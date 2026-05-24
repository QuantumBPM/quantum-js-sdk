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
    /**
     * True when at least one unresolved incident is currently attached to this instance. Computed at query time against the open-incidents index — useful for rendering a "needs attention" indicator in instance lists without paying for a per-row state fetch from the engine.
     */
    hasIncident?: boolean;
    /**
     * Timestamp at which this instance was paused at INSTANCE scope. Empty
     * when not instance-suspended. The instance may still be effectively
     * suspended via its definition — call `GetBpmnInstance` to read both
     * scopes if you need the full picture.
     *
     */
    suspendedAt?: string;
    /**
     * Operator who suspended this instance (instance scope). Empty when not instance-suspended.
     */
    suspendedBy?: string;
    /**
     * Free-text reason captured at suspend time.
     */
    suspendReason?: string;
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

