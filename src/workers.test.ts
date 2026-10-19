import { Worker, Job, WorkerConfig } from './workers';
import { RawClient } from './generated/RawClient';
import { ApiError } from './generated/core/ApiError';
import { CancelablePromise } from './generated/core/CancelablePromise';
import { Vars } from './variables';
import type { ExternalJob } from './generated';

function makeWorker(maxBytes?: number) {
    const warnings: string[] = [];
    const logger = {
        error: () => {},
        warn: (msg: string) => { warnings.push(msg); },
    };
    const fakeRaw = {} as unknown as RawClient;
    const w = new Worker(fakeRaw, '00000000-0000-0000-0000-000000000001', {
        logger,
        ...(maxBytes !== undefined ? { maxErrorMessageBytes: maxBytes } : {}),
    });
    return { w, warnings };
}

describe('Worker.clampWorkerErrorMessage', () => {
    test('passes short messages through unchanged and does not warn', () => {
        const { w, warnings } = makeWorker();
        const out = w.clampWorkerErrorMessage('payment', 'boom');
        expect(out).toBe('boom');
        expect(warnings).toHaveLength(0);
    });

    test('truncates at the default 2048-byte cap and warns once', () => {
        const { w, warnings } = makeWorker();
        const huge = 'x'.repeat(100_000);
        const out = w.clampWorkerErrorMessage('payment', huge);
        expect(Buffer.byteLength(out, 'utf8')).toBeLessThanOrEqual(2048);
        expect(out).toMatch(/ bytes\]$/);
        expect(warnings).toHaveLength(1);
        expect(warnings[0]).toContain('WORKER_ERROR message truncated');
    });

    test('honors a smaller per-worker override', () => {
        const { w } = makeWorker(256);
        const out = w.clampWorkerErrorMessage('payment', 'x'.repeat(10_000));
        expect(Buffer.byteLength(out, 'utf8')).toBeLessThanOrEqual(256);
    });

    test('cuts on a UTF-8 code-point boundary', () => {
        const { w } = makeWorker(200);
        // "é" is 2 bytes UTF-8 → boundary cuts could otherwise split a rune.
        const msg = 'é'.repeat(1000);
        const out = w.clampWorkerErrorMessage('t', msg);
        // Round-trip through Buffer should be lossless if we cut on a boundary.
        expect(Buffer.from(out, 'utf8').toString('utf8')).toBe(out);
        expect(out).not.toContain('�');
    });
});

describe('Worker job dispatch', () => {
    function setupForDispatch() {
        const raw = {
            default: {
                heartbeatBpmnExternalJob: async () => {},
                completeBpmnExternalJob: async () => {},
            },
            bpmn: {
                throwBpmnExternalJobError: async () => {},
            },
        } as unknown as RawClient;
        const w = new Worker(raw, '00000000-0000-0000-0000-000000000001', {
            logger: { error: () => {}, warn: () => {} },
        });
        return w;
    }

    function makeRaw(businessId?: string): ExternalJob {
        return {
            id: '11111111-1111-1111-1111-111111111111',
            executionKey: 'wf-1:node-a:1',
            workflowID: 'wf-1',
            nodeID: 'node-a',
            taskType: 'payment',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            ...(businessId !== undefined ? { businessId } : {}),
        } as unknown as ExternalJob;
    }

    test('Job exposes businessId from the poll response', async () => {
        const w = setupForDispatch();
        let received: Job | undefined;
        w.handle('payment', async (job) => {
            received = job;
            return new Vars();
        });

        const registration = (w as any).registrations.get('payment');
        const ac = new AbortController();
        await (w as any).dispatch(registration, makeRaw('ORDER-42'), ac.signal);

        expect(received).toBeDefined();
        expect(received!.businessId).toBe('ORDER-42');
        expect(received!.raw.businessId).toBe('ORDER-42');
    });

    test('businessId is undefined when the poll response omits it', async () => {
        const w = setupForDispatch();
        let received: Job | undefined;
        w.handle('payment', async (job) => {
            received = job;
            return new Vars();
        });

        const registration = (w as any).registrations.get('payment');
        const ac = new AbortController();
        await (w as any).dispatch(registration, makeRaw(), ac.signal);

        expect(received).toBeDefined();
        expect(received!.businessId).toBeUndefined();
    });
});

describe('Worker clientId', () => {
    const fakeRaw = {} as unknown as RawClient;
    const projectId = '00000000-0000-0000-0000-000000000001';

    test('keeps a configured clientId', () => {
        const w = new Worker(fakeRaw, projectId, { clientId: 'billing-1' });
        expect((w as any).clientId).toBe('billing-1');
    });

    // The server refuses a poll with an empty clientID, so blank falls back.
    test.each(['', '   '])('falls back to a generated id for %j', (blank) => {
        const w = new Worker(fakeRaw, projectId, { clientId: blank });
        expect((w as any).clientId).toMatch(/^worker-.+-\d+$/);
    });
});

describe('Worker locks and shutdown', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    const job = {
        executionKey: 'wf-1:node-a:1',
        workflowID: 'wf-1',
        taskType: 'payment',
    } as unknown as ExternalJob;

    function apiError(status: number): ApiError {
        return new ApiError(
            { method: 'POST', url: '' },
            { url: '', ok: false, status, statusText: '', body: undefined },
            `status ${status}`,
        );
    }

    // The first poll hands out one job. Later polls hang until cancelled.
    function setup(config: WorkerConfig = {}) {
        let polls = 0;
        const calls = {
            poll: jest.fn(() => new CancelablePromise<ExternalJob[]>((resolve) => {
                if (polls++ === 0) resolve([job]);
            })),
            heartbeat: jest.fn(async (..._args: unknown[]) => {}),
            complete: jest.fn(async (..._args: unknown[]) => {}),
            throwError: jest.fn(async (..._args: unknown[]) => {}),
        };
        const raw = {
            default: {
                pollBpmnExternalJobs: calls.poll,
                heartbeatBpmnExternalJob: calls.heartbeat,
                completeBpmnExternalJob: calls.complete,
            },
            bpmn: { throwBpmnExternalJobError: calls.throwError },
        } as unknown as RawClient;
        const warnings: string[] = [];
        const errors: string[] = [];
        const w = new Worker(raw, '00000000-0000-0000-0000-000000000001', {
            logger: {
                error: (msg: string) => { errors.push(msg); },
                warn: (msg: string) => { warnings.push(msg); },
            },
            ...config,
        });
        return { w, calls, warnings, errors };
    }

    test('a heartbeat 409 aborts the handler signal and sends no complete', async () => {
        const { w, calls, warnings } = setup();
        calls.heartbeat.mockRejectedValue(apiError(409));
        let signal: AbortSignal | undefined;
        w.handle('payment', (_job, s) => {
            signal = s;
            return new Promise((_resolve, reject) => {
                s.addEventListener('abort', () => reject(new Error('aborted')));
            });
        });

        const stop = new AbortController();
        const running = w.run(stop.signal);
        await jest.advanceTimersByTimeAsync(15_000);
        expect(signal?.aborted).toBe(true);

        await jest.advanceTimersByTimeAsync(60_000);
        stop.abort();
        await running;

        expect(calls.heartbeat).toHaveBeenCalledTimes(1);
        expect(calls.complete).not.toHaveBeenCalled();
        expect(calls.throwError).not.toHaveBeenCalled();
        expect(warnings.filter(m => m.includes('lock lost'))).toHaveLength(1);
    });

    test('after shutdown starts, a running handler keeps heartbeating and completes', async () => {
        const { w, calls } = setup();
        let signal: AbortSignal | undefined;
        let finish: (v: Vars) => void = () => {};
        w.handle('payment', (_job, s) => {
            signal = s;
            return new Promise<Vars>((resolve) => { finish = resolve; });
        }, { maxJobs: 2, lockDuration: '10s' });

        const stop = new AbortController();
        const running = w.run(stop.signal);
        await jest.advanceTimersByTimeAsync(0);
        expect(signal).toBeDefined();
        // The second poll is the in-flight long-poll that the abort cancels.
        expect(calls.poll).toHaveBeenCalledTimes(2);

        stop.abort();
        await jest.advanceTimersByTimeAsync(15_000);
        expect(calls.heartbeat).toHaveBeenCalledTimes(3);
        expect(signal!.aborted).toBe(false);

        finish(new Vars().set('ok', true));
        await running;

        expect(calls.poll).toHaveBeenCalledTimes(2);
        expect(calls.complete).toHaveBeenCalledTimes(1);
        expect(calls.complete.mock.calls[0][1]).toBe('wf-1:node-a:1');
        expect(calls.complete.mock.calls[0][2]).toMatchObject({ variables: { ok: true } });
    });

    test('the shutdown timeout aborts a handler that does not finish and run resolves', async () => {
        const { w, calls, warnings } = setup({ shutdownTimeout: '5s' });
        let signal: AbortSignal | undefined;
        w.handle('payment', (_job, s) => {
            signal = s;
            return new Promise<Vars>(() => {});
        });

        const stop = new AbortController();
        let resolved = false;
        const running = w.run(stop.signal).then(() => { resolved = true; });
        await jest.advanceTimersByTimeAsync(0);
        stop.abort();

        await jest.advanceTimersByTimeAsync(4_999);
        expect(resolved).toBe(false);
        expect(signal!.aborted).toBe(false);

        await jest.advanceTimersByTimeAsync(1);
        await running;
        expect(signal!.aborted).toBe(true);
        expect(calls.complete).not.toHaveBeenCalled();
        expect(calls.throwError).not.toHaveBeenCalled();
        expect(warnings.some(m => m.includes('shutdown timeout'))).toBe(true);
        // Heartbeat and shutdown timers are all cleared.
        expect(jest.getTimerCount()).toBe(0);
    });

    test('a complete 409 is logged as a discarded result', async () => {
        const { w, calls, warnings, errors } = setup();
        calls.complete.mockRejectedValue(apiError(409));
        w.handle('payment', async () => new Vars());

        const registration = (w as any).registrations.get('payment');
        await (w as any).dispatch(registration, job, new AbortController().signal);

        expect(warnings).toContain('workers: complete wf-1:node-a:1: lock lost, result discarded');
        expect(errors).toHaveLength(0);
    });
});
