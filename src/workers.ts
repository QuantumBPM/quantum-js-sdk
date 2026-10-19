/**
 * External job worker runtime. Register a handler per task type, then call
 * Worker.run; the runtime owns long-polling, lock heartbeats, dispatch, and
 * outcome mapping (Complete on success, ThrowError on a BpmnError, ThrowError
 * with WORKER_ERROR on any other rejection).
 */
import { hostname } from 'os';

import { context as otelContext, SpanStatusCode } from '@opentelemetry/api';

import { RawClient } from './generated/RawClient';
import { ApiError } from './generated/core/ApiError';
import { ExternalJob } from './generated/models/ExternalJob';
import { startJobSpan } from './tracing';

import { Vars } from './variables';

/**
 * Throw this from a handler to fail the job with a BPMN error code.
 * The runtime translates it into a ThrowError call against the originating
 * service task - matching boundary error events on the task can then route
 * the exception in the BPMN model.
 */
export class BpmnError extends Error {
    constructor(public readonly code: string, public readonly variables?: Vars) {
        super(`bpmn error: ${code}`);
        this.name = 'BpmnError';
    }
}

/** Job handed to a Handler. */
export interface Job<TVars = Record<string, unknown>> {
    /** Stable key for the activity execution. Path parameter for completion. */
    executionKey: string;
    /** Workflow ID of the originating instance. */
    workflowId: string;
    /** Worker selector - the task type the handler was registered for. */
    taskType: string;
    /** Input variables resolved by the service task at activity entry. */
    vars: Vars;
    /** Vars cast to TVars for opt-in typed access. No runtime validation. */
    typed: TVars;
    /** Static metadata attached at design time on the service task. */
    headers: Record<string, string>;
    /**
     * Caller-supplied correlation key inherited from the originating BPMN
     * process. Undefined when the instance was started without one. Use it
     * for log correlation or downstream tracing.
     */
    businessId?: string;
    /** Underlying generated record for low-level access. */
    raw: ExternalJob;
}

/**
 * Handler return value semantics:
 *   - resolves with Vars (or undefined) → SDK calls Complete
 *   - rejects with a BpmnError           → SDK calls ThrowError with that code as
 *                                          a business error (retryable=false):
 *                                          routed to a matching boundary error
 *                                          event immediately, bypassing retries
 *   - rejects with anything else         → SDK calls ThrowError with WORKER_ERROR
 *                                          as a retryable technical failure; the
 *                                          retry budget is consumed first
 */
export type Handler<TVars = Record<string, unknown>> = (
    job: Job<TVars>,
    signal: AbortSignal,
) => Promise<Vars | undefined>;

export interface HandleOptions {
    /** Maximum jobs in flight for this task type. Default 1. */
    maxJobs?: number;
    /** Long-poll wait - duration string like "30s", "2m". Default "30s". */
    pollTimeout?: string;
    /** Exclusive lock duration on each acquired job. Default "30s". */
    lockDuration?: string;
}

export interface WorkerConfig {
    /**
     * Stable identifier for this worker. Used to attribute job locks and
     * counted in the active-workers-per-task-type aggregate. Defaults to
     * `worker-<hostname>-<pid>`.
     */
    clientId?: string;
    /** Optional logger. Defaults to console. */
    logger?: { error(msg: string, ...args: unknown[]): void; warn(msg: string, ...args: unknown[]): void };
    /**
     * Cap on the byte length of the auto-built WORKER_ERROR message attached
     * when a handler rejects with something other than a BpmnError. Default
     * 2048. User-thrown BpmnError variables are not clamped.
     */
    maxErrorMessageBytes?: number;
    /**
     * How long run waits for running handlers once its signal aborts, as a
     * duration string like "20s". Handlers still running after it are
     * aborted and report nothing. Default "20s".
     */
    shutdownTimeout?: string;
}

interface Registration {
    taskType: string;
    handler: Handler<unknown>;
    options: Required<HandleOptions>;
}

const DEFAULT_OPTIONS: Required<HandleOptions> = {
    maxJobs: 1,
    pollTimeout: '30s',
    lockDuration: '30s',
};

const POLL_ERROR_BACKOFF_MS = 2_000;
const DEFAULT_MAX_ERROR_MESSAGE_BYTES = 2048;
const DEFAULT_SHUTDOWN_TIMEOUT = '20s';

/**
 * Worker is a long-poll runtime owning a set of handlers, one per task type.
 */
export class Worker {
    private readonly registrations = new Map<string, Registration>();
    private readonly clientId: string;
    private readonly logger: NonNullable<WorkerConfig['logger']>;
    private readonly maxErrorMessageBytes: number;
    private readonly shutdownTimeoutMs: number;

    constructor(
        private readonly raw: RawClient,
        private readonly projectId: string,
        config: WorkerConfig = {},
    ) {
        this.clientId = config.clientId?.trim() || `worker-${hostname()}-${process.pid}`;
        this.logger = config.logger ?? console;
        this.maxErrorMessageBytes =
            config.maxErrorMessageBytes && config.maxErrorMessageBytes > 0
                ? config.maxErrorMessageBytes
                : DEFAULT_MAX_ERROR_MESSAGE_BYTES;
        this.shutdownTimeoutMs = parseDurationMs(config.shutdownTimeout ?? DEFAULT_SHUTDOWN_TIMEOUT) ?? 20_000;
    }

    /**
     * Register handler as the processor for taskType. Re-registering an
     * existing taskType replaces the previous handler.
     */
    handle<TVars = Record<string, unknown>>(
        taskType: string,
        handler: Handler<TVars>,
        options: HandleOptions = {},
    ): this {
        this.registrations.set(taskType, {
            taskType,
            handler: handler as Handler<unknown>,
            options: { ...DEFAULT_OPTIONS, ...options },
        });
        return this;
    }

    /**
     * Start the polling loops. When `signal` aborts, polling stops and
     * running handlers get up to shutdownTimeout to finish and report.
     * Resolves once they have, or once the timeout aborts the rest.
     */
    async run(signal: AbortSignal): Promise<void> {
        if (this.registrations.size === 0) {
            throw new Error('workers: no handlers registered');
        }
        const hardStop = new AbortController();
        let timer: NodeJS.Timeout | undefined;
        const onAbort = () => {
            timer = setTimeout(() => hardStop.abort(), this.shutdownTimeoutMs);
        };
        signal.addEventListener('abort', onAbort, { once: true });
        try {
            await Promise.all([...this.registrations.values()].map(r => this.runTaskType(r, signal, hardStop.signal)));
        } finally {
            signal.removeEventListener('abort', onAbort);
            clearTimeout(timer);
        }
    }

    private async runTaskType(r: Registration, signal: AbortSignal, hardStop: AbortSignal): Promise<void> {
        const inflight = new Set<Promise<void>>();

        while (!signal.aborted) {
            // Wait until at least one slot is free.
            while (inflight.size >= r.options.maxJobs && !signal.aborted) {
                await anySettledOrAborted(inflight, signal);
            }
            if (signal.aborted) break;

            const slots = r.options.maxJobs - inflight.size;
            let jobs: ExternalJob[];
            try {
                jobs = await this.poll(r, slots, signal);
            } catch (err) {
                if (signal.aborted) break;
                this.logger.error(`workers: poll ${r.taskType}`, err);
                await sleep(POLL_ERROR_BACKOFF_MS, signal);
                continue;
            }

            // Jobs from a poll that raced the abort still run and report.
            for (const job of jobs) {
                const p = this.dispatch(r, job, hardStop).finally(() => inflight.delete(p));
                inflight.add(p);
            }
        }

        await anySettledOrAborted([Promise.allSettled(inflight)], hardStop);
        if (inflight.size > 0) {
            this.logger.warn(`workers: shutdown timeout, abandoning ${inflight.size} ${r.taskType} job(s)`);
        }
    }

    private async poll(r: Registration, slots: number, signal: AbortSignal): Promise<ExternalJob[]> {
        const maxJobs = Math.max(1, Math.min(r.options.maxJobs, slots));
        const req = this.raw.default.pollBpmnExternalJobs(this.projectId, {
            clientID: this.clientId,
            taskType: r.taskType,
            maxJobs,
            timeout: r.options.pollTimeout,
            lockDuration: r.options.lockDuration,
        });
        const onAbort = () => req.cancel();
        signal.addEventListener('abort', onAbort, { once: true });
        try {
            return (await req) ?? [];
        } finally {
            signal.removeEventListener('abort', onAbort);
        }
    }

    private async dispatch(r: Registration, raw: ExternalJob, hardStop: AbortSignal): Promise<void> {
        const { ctx: spanCtx, span } = startJobSpan(raw, r.taskType);

        // The job signal aborts on a lost lock or when the shutdown timeout
        // passes. An aborted job reports nothing because its lock is gone.
        const ac = new AbortController();
        const onHardStop = () => ac.abort();
        hardStop.addEventListener('abort', onHardStop, { once: true });
        const stopHeartbeat = this.startHeartbeat(r, raw, ac);

        try {
            const vars = Vars.fromWireMap(raw.variables);
            const job: Job<unknown> = {
                executionKey: raw.executionKey,
                workflowId: raw.workflowID,
                taskType: r.taskType,
                vars,
                typed: vars.toRecord(),
                headers: raw.headers ?? {},
                businessId: raw.businessId,
                raw,
            };
            // Run the handler (and the success-path complete) under the span so
            // the user's own OpenTelemetry work nests beneath it.
            await otelContext.with(spanCtx, async () => {
                const result = await r.handler(job, ac.signal);
                stopHeartbeat();
                if (ac.signal.aborted) return;
                await this.complete(raw, result ?? new Vars());
            });
        } catch (err) {
            stopHeartbeat();
            if (ac.signal.aborted) return;
            if (err instanceof BpmnError) {
                span.setAttribute('bpmn.error_code', err.code);
                // Business outcome: route to the boundary immediately
                // (retryable=false), bypassing the retry budget.
                await this.throwError(raw, err.code, err.variables ?? new Vars(), false);
            } else {
                this.logger.error(`workers: handler ${r.taskType}`, err);
                const message = err instanceof Error ? err.message : String(err);
                if (err instanceof Error) span.recordException(err);
                span.setStatus({ code: SpanStatusCode.ERROR, message });
                const clamped = this.clampWorkerErrorMessage(r.taskType, message);
                // Technical failure: retryable, so the server consumes the
                // retry budget before surfacing it.
                await this.throwError(raw, 'WORKER_ERROR', new Vars().set('error', clamped), true);
            }
        } finally {
            span.end();
            hardStop.removeEventListener('abort', onHardStop);
            ac.abort();
        }
    }

    /**
     * Heartbeat at lockDuration / 2, with a 1-second floor, until the returned
     * stop is called or ac aborts. A 409 or 404 means this worker no longer
     * holds the job, so it aborts ac.
     */
    private startHeartbeat(r: Registration, job: ExternalJob, ac: AbortController): () => void {
        const lockMs = parseDurationMs(r.options.lockDuration) ?? 30_000;
        const interval = Math.max(1_000, Math.floor(lockMs / 2));
        let stopped = false;
        let inFlight = false;
        const timer = setInterval(async () => {
            if (inFlight) return;
            inFlight = true;
            try {
                await this.raw.default.heartbeatBpmnExternalJob(this.projectId, job.executionKey, {
                    clientID: this.clientId,
                    lockDuration: r.options.lockDuration,
                });
            } catch (err) {
                if (stopped) return;
                const status = httpStatus(err);
                if (status === 409 || status === 404) {
                    this.logger.warn(`workers: lock lost on ${job.executionKey}, aborting the handler`);
                    ac.abort();
                } else {
                    this.logger.warn(`workers: heartbeat ${job.executionKey}`, err);
                }
            } finally {
                inFlight = false;
            }
        }, interval);
        const stop = () => {
            stopped = true;
            clearInterval(timer);
        };
        ac.signal.addEventListener('abort', stop, { once: true });
        return stop;
    }

    private async complete(job: ExternalJob, vars: Vars): Promise<void> {
        try {
            await this.raw.default.completeBpmnExternalJob(this.projectId, job.executionKey, {
                workflowID: job.workflowID,
                clientID: this.clientId,
                variables: vars.toWireMap() as any,
            });
        } catch (err) {
            this.logReportError('complete', job, err);
        }
    }

    private async throwError(job: ExternalJob, code: string, vars: Vars, retryable: boolean): Promise<void> {
        try {
            await this.raw.bpmn.throwBpmnExternalJobError(this.projectId, job.executionKey, {
                errorCode: code,
                clientID: this.clientId,
                retryable,
                variables: vars.toWireMap() as any,
            });
        } catch (err) {
            this.logReportError('throwError', job, err);
        }
    }

    private logReportError(op: string, job: ExternalJob, err: unknown): void {
        // 409 means this worker no longer holds the job's lock.
        if (httpStatus(err) === 409) {
            this.logger.warn(`workers: ${op} ${job.executionKey}: lock lost, result discarded`);
        } else {
            this.logger.error(`workers: ${op} ${job.executionKey}`, err);
        }
    }

    /**
     * Shortens an unhandled handler exception's message to the configured
     * byte budget. UTF-8 safe (cuts on code-point boundary). Logs a WARN
     * and appends a truncation marker when it triggers. Visible to tests.
     */
    clampWorkerErrorMessage(taskType: string, msg: string): string {
        const limit = this.maxErrorMessageBytes;
        const encoder = new TextEncoder();
        const bytes = encoder.encode(msg);
        if (limit <= 0 || bytes.length <= limit) {
            return msg;
        }
        const marker = `…[truncated, original ${bytes.length} bytes]`;
        const markerBytes = encoder.encode(marker).length;
        const budget = Math.max(0, limit - markerBytes);
        // Cut on a code-point boundary so we never emit half a multi-byte rune.
        const slice = bytes.subarray(0, budget);
        const decoded = new TextDecoder('utf-8', { fatal: false }).decode(slice).replace(/�+$/, '');
        this.logger.warn(
            `workers: WORKER_ERROR message truncated for task=${taskType} from ${bytes.length} to ${limit} bytes`,
        );
        return decoded + marker;
    }
}

function parseDurationMs(d: string): number | null {
    // Accepts forms like "30s", "2m", "1h", "500ms".
    const m = /^(\d+)(ms|s|m|h)$/.exec(d.trim());
    if (!m) return null;
    const value = parseInt(m[1], 10);
    switch (m[2]) {
        case 'ms': return value;
        case 's': return value * 1_000;
        case 'm': return value * 60_000;
        case 'h': return value * 3_600_000;
        default: return null;
    }
}

function httpStatus(err: unknown): number | undefined {
    return err instanceof ApiError ? err.status : undefined;
}

/** Resolves once any of `promises` settles or `signal` aborts. */
function anySettledOrAborted(promises: Iterable<Promise<unknown>>, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
        if (signal.aborted) {
            resolve();
            return;
        }
        const done = () => {
            signal.removeEventListener('abort', done);
            resolve();
        };
        signal.addEventListener('abort', done, { once: true });
        for (const p of promises) p.then(done, done);
    });
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        signal.addEventListener('abort', () => {
            clearTimeout(t);
            resolve();
        }, { once: true });
    });
}
