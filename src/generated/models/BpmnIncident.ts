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
     * * `EscalationError` - A `bpmn:escalation` raised by the process.
     * * `CompensationError` - Failure during compensation handler execution.
     * * `FeelError` - A FEEL expression failed to evaluate.
     * * `NoHandler` - A thrown error/escalation has no matching catch event.
     * * `GatewayNoMatch` - An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` - A timer expression could not be parsed or resolved.
     * * `LinkNotFound` - A link throw event has no matching link catch.
     * * `MigrationError` - A process instance migration could not be applied.
     * * `SubscriptionError` - A message/signal listener's registry row could not be written; the listener is dead until resolved.
     * * `RotationLimitError` - The instance reached its ContinueAsNew rotation cap.
     * * `SnapshotSizeExceeded` - A ContinueAsNew snapshot exceeded the configured size cap.
     * * `CallActivityCanceled` - A call-activity child terminated as Canceled out-of-band.
     * * `ExternalRowRefreshError` - A migration could not rewrite a parked wait's external row (job, user task or subscription) against the target definition. Resolving re-runs the refresh.
     * * `Unknown` - Internal error not classified above.
     *
     */
    errorType?: BpmnIncident.errorType;
    /**
     * Variables in scope at the time of the error.
     */
    variables?: Record<string, any>;
    /**
     * Unix epoch milliseconds when the incident was recorded.
     */
    timestamp?: number;
};
export namespace BpmnIncident {
    /**
     * Category of the error. Values:
     * * `BpmnError` - A `bpmn:error` thrown by the process or an external job worker.
     * * `EscalationError` - A `bpmn:escalation` raised by the process.
     * * `CompensationError` - Failure during compensation handler execution.
     * * `FeelError` - A FEEL expression failed to evaluate.
     * * `NoHandler` - A thrown error/escalation has no matching catch event.
     * * `GatewayNoMatch` - An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` - A timer expression could not be parsed or resolved.
     * * `LinkNotFound` - A link throw event has no matching link catch.
     * * `MigrationError` - A process instance migration could not be applied.
     * * `SubscriptionError` - A message/signal listener's registry row could not be written; the listener is dead until resolved.
     * * `RotationLimitError` - The instance reached its ContinueAsNew rotation cap.
     * * `SnapshotSizeExceeded` - A ContinueAsNew snapshot exceeded the configured size cap.
     * * `CallActivityCanceled` - A call-activity child terminated as Canceled out-of-band.
     * * `ExternalRowRefreshError` - A migration could not rewrite a parked wait's external row (job, user task or subscription) against the target definition. Resolving re-runs the refresh.
     * * `Unknown` - Internal error not classified above.
     *
     */
    export enum errorType {
        BPMN_ERROR = 'BpmnError',
        ESCALATION_ERROR = 'EscalationError',
        COMPENSATION_ERROR = 'CompensationError',
        FEEL_ERROR = 'FeelError',
        NO_HANDLER = 'NoHandler',
        GATEWAY_NO_MATCH = 'GatewayNoMatch',
        TIMER_RESOLUTION = 'TimerResolution',
        LINK_NOT_FOUND = 'LinkNotFound',
        MIGRATION_ERROR = 'MigrationError',
        SUBSCRIPTION_ERROR = 'SubscriptionError',
        ROTATION_LIMIT_ERROR = 'RotationLimitError',
        SNAPSHOT_SIZE_EXCEEDED = 'SnapshotSizeExceeded',
        CALL_ACTIVITY_CANCELED = 'CallActivityCanceled',
        EXTERNAL_ROW_REFRESH_ERROR = 'ExternalRowRefreshError',
        UNKNOWN = 'Unknown',
    }
}

