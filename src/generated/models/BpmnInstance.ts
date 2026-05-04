/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A running or completed execution of a BPMN process.
 */
export type BpmnInstance = {
    /**
     * ID of the deployed BPMN process definition this instance is running.
     */
    definitionID: string;
    /**
     * Stable execution identifier for this instance. Use this to address the instance in all API calls — fetch state, send signals/messages, complete user tasks, list children, cancel, etc.
     */
    workflowID: string;
    /**
     * Execution identifier of the parent instance that started this one via a CallActivity. Empty for top-level instances.
     */
    parentWorkflowID?: string;
    /**
     * Current lifecycle status of the instance.
     */
    status: BpmnInstance.status;
    /**
     * User or service account that initiated the instance.
     */
    startedBy?: string;
    /**
     * Timestamp when the instance was started.
     */
    createdAt: string;
    /**
     * Timestamp when the instance reached a terminal status. Empty while running.
     */
    completedAt?: string;
};
export namespace BpmnInstance {
    /**
     * Current lifecycle status of the instance.
     */
    export enum status {
        RUNNING = 'RUNNING',
        COMPLETED = 'COMPLETED',
        FAILED = 'FAILED',
        CANCELED = 'CANCELED',
        TERMINATED = 'TERMINATED',
        TIMED_OUT = 'TIMED_OUT',
    }
}

