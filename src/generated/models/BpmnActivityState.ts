/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Execution record for a single BPMN activity (service task, user task, gateway, etc.).
 */
export type BpmnActivityState = {
    /**
     * Position of the entry in the instance's history, from 1.
     */
    seq?: number;
    /**
     * ID of the BPMN flow node.
     */
    nodeID?: string;
    /**
     * Type of the BPMN node (e.g. ServiceTask, UserTask, ExclusiveGateway).
     */
    nodeType?: string;
    /**
     * Execution outcome - Started, Completed, Failed, Canceled, or Resolved. `Resolved` replaces `Failed` once the originating incident is removed (retry, modification-cancel, boundary catch); the entry's `errorMessage` is preserved so the failed attempt remains auditable.
     */
    status?: BpmnActivityState.status;
    /**
     * When the element started. Each entry records one event, so a Started entry carries it and a Completed, Failed, Canceled or Resolved entry leaves it out. An entry for an operation, such as a suspension or a migration, carries both times. Entries are ordered by `seq`, not by time.
     */
    startTime?: string;
    /**
     * When the element ended. Absent on a Started entry.
     */
    endTime?: string;
    /**
     * Input variables evaluated at activity entry. Absent on history page entries.
     */
    inputs?: Record<string, any>;
    /**
     * Output variables produced by the activity. Absent on history page entries.
     */
    outputs?: Record<string, any>;
    /**
     * Failure reason on Failed / Canceled / Resolved entries. Empty on success paths.
     */
    errorMessage?: string;
    /**
     * BPMN `errorCode` of the throw error that caused the failure. Set on Failed/Resolved entries originating from a BPMN error; empty for non-BPMN failures. Error variables (if any) ride on `outputs` since a Failed entry doesn't otherwise produce outputs.
     */
    errorCode?: string;
    /**
     * Key of the element's execution, the same on its Started and its ending entry. Absent for an element that runs no execution, such as a start or end event.
     */
    executionKey?: string;
    /**
     * User or service account whose call produced this entry: the completion of a job or user task, the publish of a message or signal a catch took, a start, a resolve, a suspension or a cancel. Empty for an entry the engine produced on its own.
     */
    actor?: string;
    /**
     * Task type of the external job this entry ended, on the Completed, Failed or Canceled entry of a job's element. Empty otherwise.
     */
    taskType?: string;
    /**
     * Retries the external job had left when a worker or a lock expiry reported its outcome. Absent on a job the engine canceled.
     */
    retries?: number;
    /**
     * `clientID` of the worker that reported the external job's outcome, or whose lock ran out. Empty when no worker was named.
     */
    worker?: string;
    /**
     * For CallActivity nodes, the identifier of the child instance spawned by this execution. Empty for non-CallActivity nodes.
     */
    childInstanceID?: string;
    /**
     * IDs of the sequence flows that brought the token to this element, on its first entry (Started, or Completed for an element without duration). A join firing lists every flow it consumed, a join cancelled before it fired lists the flows that had reached it. A flow is taken when some entry lists it, together with `pendingJoinArrivals` on the instance state.
     */
    incomingFlows?: Array<string>;
};
export namespace BpmnActivityState {
    /**
     * Execution outcome - Started, Completed, Failed, Canceled, or Resolved. `Resolved` replaces `Failed` once the originating incident is removed (retry, modification-cancel, boundary catch); the entry's `errorMessage` is preserved so the failed attempt remains auditable.
     */
    export enum status {
        STARTED = 'Started',
        COMPLETED = 'Completed',
        FAILED = 'Failed',
        CANCELED = 'Canceled',
        RESOLVED = 'Resolved',
    }
}

