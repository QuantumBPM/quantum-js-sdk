/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * An error that halted execution of a BPMN node and requires manual resolution.
 */
export type BpmnIncident = {
    /**
     * Unique identifier of this incident.
     */
    incidentID?: string;
    /**
     * ID of the BPMN node where the error occurred.
     */
    nodeID?: string;
    /**
     * ID of the scope in which the error occurred.
     */
    scopeID?: string;
    /**
     * Execution key of the activity that failed.
     */
    executionKey?: string;
    /**
     * ID of the scope containing `scopeID`, empty for the root scope. Scope IDs are opaque, so this is how a client walks a failure back up the process tree.
     */
    parentScopeID?: string;
    /**
     * Zero-based multi-instance body index when the failure happened inside one iteration of a multi-instance activity. Absent otherwise.
     */
    miIndex?: number;
    /**
     * Human-readable description of the error.
     */
    errorMessage?: string;
    /**
     * BPMN error code from the process definition; empty for non-BPMN errors.
     */
    errorCode?: string;
    /**
     * Category of the error. Values:
     * * `BpmnError` - A `bpmn:error` thrown by the process or an external job worker.
     * * `CompensationError` - Failure during compensation handler execution.
     * * `FeelError` - A FEEL expression failed to evaluate.
     * * `GatewayNoMatch` - An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` - A timer expression could not be parsed or resolved.
     * * `LinkNotFound` - A link throw event has no matching link catch.
     * * `MigrationError` - A process instance migration could not be applied.
     * * `CallActivityCanceled` - A call-activity child terminated as Canceled out-of-band.
     * * `ExternalRowRefreshError` - A migration could not rewrite a parked wait's external row (job, user task or subscription) against the target definition. Resolving re-runs the refresh.
     * * `JobLockLost` - An external job's worker lock ran out, by missed heartbeats or the maximum hold, with no retries left.
     * * `DecisionNotFound` - A business rule task called a decision, or a pinned version of one, that is not deployed.
     * * `DecisionEvaluationError` - The decision a business rule task called failed while it was evaluated, such as a FEEL error or a violated hit policy. The failed evaluation is recorded.
     * * `ProcessNotFound` - A call activity called a process, or a pinned version of one, that is not deployed.
     * * `ProcessSuspended` - A call activity called a suspended process version.
     * * `Unknown` - Internal error not classified above.
     *
     */
    errorType?: BpmnIncident.errorType;
    /**
     * Variables in scope at the time of the error.
     */
    variables?: Record<string, any>;
    /**
     * When the incident was raised.
     */
    raisedAt?: string;
};
export namespace BpmnIncident {
    /**
     * Category of the error. Values:
     * * `BpmnError` - A `bpmn:error` thrown by the process or an external job worker.
     * * `CompensationError` - Failure during compensation handler execution.
     * * `FeelError` - A FEEL expression failed to evaluate.
     * * `GatewayNoMatch` - An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` - A timer expression could not be parsed or resolved.
     * * `LinkNotFound` - A link throw event has no matching link catch.
     * * `MigrationError` - A process instance migration could not be applied.
     * * `CallActivityCanceled` - A call-activity child terminated as Canceled out-of-band.
     * * `ExternalRowRefreshError` - A migration could not rewrite a parked wait's external row (job, user task or subscription) against the target definition. Resolving re-runs the refresh.
     * * `JobLockLost` - An external job's worker lock ran out, by missed heartbeats or the maximum hold, with no retries left.
     * * `DecisionNotFound` - A business rule task called a decision, or a pinned version of one, that is not deployed.
     * * `DecisionEvaluationError` - The decision a business rule task called failed while it was evaluated, such as a FEEL error or a violated hit policy. The failed evaluation is recorded.
     * * `ProcessNotFound` - A call activity called a process, or a pinned version of one, that is not deployed.
     * * `ProcessSuspended` - A call activity called a suspended process version.
     * * `Unknown` - Internal error not classified above.
     *
     */
    export enum errorType {
        BPMN_ERROR = 'BpmnError',
        COMPENSATION_ERROR = 'CompensationError',
        FEEL_ERROR = 'FeelError',
        GATEWAY_NO_MATCH = 'GatewayNoMatch',
        TIMER_RESOLUTION = 'TimerResolution',
        LINK_NOT_FOUND = 'LinkNotFound',
        MIGRATION_ERROR = 'MigrationError',
        CALL_ACTIVITY_CANCELED = 'CallActivityCanceled',
        EXTERNAL_ROW_REFRESH_ERROR = 'ExternalRowRefreshError',
        JOB_LOCK_LOST = 'JobLockLost',
        DECISION_NOT_FOUND = 'DecisionNotFound',
        DECISION_EVALUATION_ERROR = 'DecisionEvaluationError',
        PROCESS_NOT_FOUND = 'ProcessNotFound',
        PROCESS_SUSPENDED = 'ProcessSuspended',
        UNKNOWN = 'Unknown',
    }
}

