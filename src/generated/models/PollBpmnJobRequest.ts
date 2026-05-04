/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Long-poll request for external jobs.
 */
export type PollBpmnJobRequest = {
    /**
     * Selector for the kind of work the worker handles.
     */
    taskType: string;
    /**
     * Stable identifier for this worker. Used to attribute job locks and to count active workers.
     */
    clientID: string;
    /**
     * Exclusive lock duration on each acquired job. Accepts Go duration strings (e.g. `5s`, `2m`). Defaults to `30s`.
     */
    lockDuration?: string;
    /**
     * How long to wait for a job before returning 204. Accepts Go duration strings. Defaults to `30s`.
     */
    timeout?: string;
    /**
     * Maximum number of jobs to acquire in one call. Defaults to 1, capped at 100.
     */
    maxJobs?: number;
};

