/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A unit of work emitted by a BPMN service task that an external worker is expected to handle.
 */
export type ExternalJob = {
    /**
     * Unique identifier of this job record.
     */
    id: string;
    /**
     * Stable key for the activity execution that produced the job. Used as the path parameter when completing or failing the job.
     */
    executionKey: string;
    /**
     * Identifier of the instance that produced the job. Required when calling Complete / ThrowError.
     */
    workflowID: string;
    /**
     * ID of the BPMN service-task node.
     */
    nodeID: string;
    /**
     * Worker selector. Workers poll for jobs by `taskType`.
     */
    taskType: string;
    /**
     * Input variables resolved by the service task at activity entry.
     */
    variables?: Record<string, any>;
    /**
     * Identifier of the parent instance (set when the producing instance was started by a CallActivity).
     */
    parentWorkflowID?: string;
    /**
     * Lifecycle status of the job.
     */
    status: ExternalJob.status;
    /**
     * Remaining retry budget. Decremented each time the worker reports a failure that the BPMN model maps to a retry.
     */
    retries?: number;
    /**
     * Static metadata attached at design time on the service task. Available to workers but not merged back into the instance.
     */
    headers?: Record<string, string>;
    /**
     * Timestamp when the job was created.
     */
    createdAt: string;
    /**
     * Timestamp when the job reached a terminal status.
     */
    completedAt?: string;
    /**
     * Worker `clientID` that currently holds the exclusive lock on the job.
     */
    lockedBy?: string;
    /**
     * Time at which the lock will be released if not extended via Heartbeat.
     */
    lockExpiresAt?: string;
    /**
     * Best-effort label describing why a CANCELED job was interrupted (e.g. instance cancelled, instance terminated).
     */
    cancelReason?: string;
};
export namespace ExternalJob {
    /**
     * Lifecycle status of the job.
     */
    export enum status {
        PENDING = 'PENDING',
        COMPLETED = 'COMPLETED',
        CANCELED = 'CANCELED',
        FAILED = 'FAILED',
    }
}

