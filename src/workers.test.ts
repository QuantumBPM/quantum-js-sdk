import { Worker } from './workers';
import { RawClient } from './generated/RawClient';

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
