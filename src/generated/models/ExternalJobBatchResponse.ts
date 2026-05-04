/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Per-item result of a batch complete or batch error call.
 */
export type ExternalJobBatchResponse = {
    results: Array<{
        /**
         * The execution key of the item from the request.
         */
        executionKey: string;
        /**
         * Outcome for this item:
         * * `completed` — the job was completed successfully.
         * * `failed` — the job exhausted its retries and surfaced as an incident.
         * * `requeued` — a retry budget remained, the job is back in PENDING.
         * * `error` — the per-item operation itself failed; the job's state is unchanged.
         *
         */
        status: 'completed' | 'failed' | 'requeued' | 'error';
        /**
         * When `status` is `error`, a human-readable description of the failure.
         */
        error?: string;
    }>;
};

