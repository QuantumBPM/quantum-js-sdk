/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A human-handled work item produced by a BPMN user task or manual task.
 */
export type UserTask = {
    /**
     * Unique identifier of this user task record.
     */
    id: string;
    /**
     * Stable key for the activity execution. Used as the path parameter when completing or failing the task.
     */
    executionKey: string;
    /**
     * Identifier of the instance that produced the task.
     */
    workflowID: string;
    /**
     * Identifier of the parent instance (set when the producing instance was started by a CallActivity).
     */
    parentWorkflowID?: string;
    /**
     * ID of the BPMN node that emitted the task.
     */
    nodeID: string;
    /**
     * BPMN element type — typically `UserTask` or `ManualTask`.
     */
    taskType?: string;
    /**
     * User the task is currently assigned to. Empty when the task is in a candidate pool but not yet claimed.
     */
    assignee?: string;
    /**
     * Users who may claim or complete this task even when no `assignee` is set.
     */
    candidateUsers?: Array<string>;
    /**
     * Identity-provider groups whose members may claim or complete this task.
     */
    candidateGroups?: Array<string>;
    /**
     * Static form reference declared on the task (BPMN `formKey`). Resolved by the consumer to display the right UI.
     */
    formKey?: string;
    /**
     * Resolved internal form identifier when `formKey` matches a stored form definition.
     */
    formID?: string;
    /**
     * Input variables resolved at activity entry. Available for rendering form defaults.
     */
    variables?: Record<string, any>;
    /**
     * Static metadata attached at design time on the user task.
     */
    headers?: Record<string, string>;
    /**
     * Lifecycle status of the task.
     */
    status: UserTask.status;
    /**
     * Best-effort label describing why a CANCELED task was interrupted (e.g. instance cancelled, boundary event interrupted).
     */
    cancelReason?: string;
    /**
     * BPMN error code captured when the task was failed via ThrowError. Set only for FAILED tasks.
     */
    errorCode?: string;
    /**
     * Variables submitted alongside the completion or error call. Set for COMPLETED and FAILED tasks.
     */
    completionVariables?: Record<string, any>;
    /**
     * Timestamp when the task was created.
     */
    createdAt: string;
    /**
     * Timestamp when the task reached a terminal status.
     */
    completedAt?: string;
};
export namespace UserTask {
    /**
     * Lifecycle status of the task.
     */
    export enum status {
        CREATED = 'CREATED',
        COMPLETED = 'COMPLETED',
        CANCELED = 'CANCELED',
        FAILED = 'FAILED',
    }
}

