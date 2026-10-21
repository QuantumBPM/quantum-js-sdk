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

/**
 * Durations are Go duration strings such as "30s", "1m30s", "12.5s" or
 * "500ms". handle() throws on a value that does not parse.
 */
export interface HandleOptions {
    /** Maximum jobs in flight for this task type. Default 1. */
    maxJobs?: number;
    /** Long-poll wait. Default "30s". */
    pollTimeout?: string;
    /**
     * Exclusive lock duration on each acquired job. The server clamps it,
     * by default to between 10s and 5m. Default "30s".
     */
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
     * Go duration like "20s" (the constructor throws on an invalid one).
     * Handlers still running after it are aborted and report nothing. Default "20s".
     */
    shutdownTimeout?: string;
}

interface Registration {
    taskType: string;
    handler: Handler<unknown>;
    options: Required<HandleOptions>;
    lockMs: number;
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
        this.shutdownTimeoutMs = requireDurationMs('shutdownTimeout', config.shutdownTimeout ?? DEFAULT_SHUTDOWN_TIMEOUT);
    }

    /**
     * Register handler as the processor for taskType. Re-registering an
     * existing taskType replaces the previous handler. Throws when
     * lockDuration or pollTimeout is not a valid duration.
     */
    handle<TVars = Record<string, unknown>>(
        taskType: string,
        handler: Handler<TVars>,
        options: HandleOptions = {},
    ): this {
        const opts = { ...DEFAULT_OPTIONS, ...options };
        const lockMs = requireDurationMs('lockDuration', opts.lockDuration);
        requireDurationMs('pollTimeout', opts.pollTimeout);
        // The server rejects a duration with surrounding spaces.
        opts.lockDuration = opts.lockDuration.trim();
        opts.pollTimeout = opts.pollTimeout.trim();
        this.registrations.set(taskType, {
            taskType,
            handler: handler as Handler<unknown>,
            options: opts,
            lockMs,
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
     * Heartbeat at heartbeatIntervalMs until the returned stop is called or
     * ac aborts. A 409 or 404 means this worker no longer holds the job, so
     * it aborts ac.
     */
    private startHeartbeat(r: Registration, job: ExternalJob, ac: AbortController): () => void {
        const interval = heartbeatIntervalMs(r.lockMs, job.lockExpiresAt, Date.now());
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
                    this.logger.warn(`workers: heartbeat ${job.executionKey}: ${conflictReason(err)}, aborting the handler`);
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
        // 409 means this worker no longer holds the job.
        if (httpStatus(err) === 409) {
            this.logger.warn(`workers: ${op} ${job.executionKey}: result discarded: ${conflictReason(err)}`);
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

/**
 * Half of the lock the server granted, or of the requested lock when that is
 * shorter, with a 1-second floor. The requested lock alone counts when
 * lockExpiresAt is missing or not in the future (client clock skew).
 */
export function heartbeatIntervalMs(requestedMs: number, lockExpiresAt: string | undefined, nowMs: number): number {
    const grantedMs = lockExpiresAt ? Date.parse(lockExpiresAt) - nowMs : NaN;
    const baseMs = grantedMs > 0 ? Math.min(requestedMs, grantedMs) : requestedMs;
    return Math.max(1_000, Math.floor(baseMs / 2));
}

const DURATION_UNIT_MS: Record<string, number> = {
    ns: 1e-6, us: 1e-3, 'µs': 1e-3, 'μs': 1e-3, ms: 1, s: 1_000, m: 60_000, h: 3_600_000,
};
const DURATION_RE = /^[-+]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:ns|us|µs|μs|ms|s|m|h))+$/;
const DURATION_PART_RE = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|μs|ms|s|m|h)/g;

/**
 * Parses a Go duration string ("30s", "1m30s", "12.5s", "500ms", "0") into
 * milliseconds, the format the server parses, ignoring surrounding spaces.
 * Returns null when invalid.
 */
export function parseDurationMs(d: string): number | null {
    if (typeof d !== 'string') return null;
    d = d.trim();
    if (/^[-+]?0$/.test(d)) return 0;
    if (!DURATION_RE.test(d)) return null;
    let ms = 0;
    for (const [, value, unit] of d.matchAll(DURATION_PART_RE)) {
        ms += parseFloat(value) * DURATION_UNIT_MS[unit];
    }
    return d.startsWith('-') ? -ms : ms;
}

function requireDurationMs(option: string, value: string): number {
    const ms = parseDurationMs(value);
    if (ms === null) {
        throw new Error(`workers: invalid ${option} ${JSON.stringify(value)}, use a duration such as 30s, 1m30s or 12.5s`);
    }
    return ms;
}

function httpStatus(err: unknown): number | undefined {
    return err instanceof ApiError ? err.status : undefined;
}

/**
 * The message of the server's error body, which says why this worker no longer
 * holds the job, for example that its instance was cancelled.
 */
function conflictReason(err: unknown): string {
    const body = err instanceof ApiError ? err.body : undefined;
    const message = body && typeof body === 'object' ? (body as { message?: unknown }).message : undefined;
    return typeof message === 'string' && message ? message : 'this worker no longer holds the job';
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
