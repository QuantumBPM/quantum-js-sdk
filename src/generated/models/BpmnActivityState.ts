/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Execution record for a single BPMN activity (service task, user task, gateway, etc.).
 */
export type BpmnActivityState = {
    /**
     * ID of the BPMN flow node.
     */
    nodeID?: string;
    /**
     * Type of the BPMN node (e.g. ServiceTask, UserTask, ExclusiveGateway).
     */
    nodeType?: string;
    /**
     * Execution outcome — Started, Completed, Failed, or Canceled.
     */
    status?: BpmnActivityState.status;
    /**
     * Unix epoch nanoseconds when execution began.
     */
    startTime?: number;
    /**
     * Unix epoch nanoseconds when execution ended; 0 if still running.
     */
    endTime?: number;
    /**
     * Input variables evaluated at activity entry.
     */
    inputs?: Record<string, any>;
    /**
     * Output variables produced by the activity.
     */
    outputs?: Record<string, any>;
    /**
     * Unique key identifying this execution (used to correlate external jobs).
     */
    executionKey?: string;
    /**
     * For CallActivity nodes, the execution identifier of the child instance spawned by this execution. Empty for non-CallActivity nodes and for the brief window between activity start and child instance startup.
     */
    childWorkflowID?: string;
};
export namespace BpmnActivityState {
    /**
     * Execution outcome — Started, Completed, Failed, or Canceled.
     */
    export enum status {
        STARTED = 'Started',
        COMPLETED = 'Completed',
        FAILED = 'Failed',
        CANCELED = 'Canceled',
    }
}

