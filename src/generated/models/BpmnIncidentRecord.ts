/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A persisted incident - the cross-instance audit row that backs the
 * "Incidents" view. The same incident is also available in
 * `BpmnInstanceState.incidents` while it is open and the instance runs. The
 * persisted row additionally carries `raisedAt` / `resolvedAt` /
 * `resolvedBy` and the parent process metadata so it can be listed and
 * filtered without joining back to the instance.
 *
 */
export type BpmnIncidentRecord = {
    /**
     * Engine-assigned incident identifier, unique within the instance. Resolve the incident with it.
     */
    incidentID: string;
    /**
     * Identifier of the instance that produced the incident.
     */
    instanceID: string;
    /**
     * BPMN process ID of the definition the instance is running.
     */
    processID?: string;
    /**
     * Human-readable name of the parent process definition.
     */
    processName?: string;
    /**
     * Version of that process definition. With `processID` it addresses the exact version the incident was raised on.
     */
    processVersion?: number;
    /**
     * ID of the BPMN node where the error occurred.
     */
    nodeID: string;
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
     * Category of the error - same enum as `BpmnIncident.errorType`.
     */
    errorType: BpmnIncidentRecord.errorType;
    /**
     * BPMN error code from the process definition; empty for non-BPMN errors.
     */
    errorCode?: string;
    /**
     * Human-readable description of the error.
     */
    errorMessage: string;
    /**
     * Timestamp when the engine recorded the incident.
     */
    raisedAt: string;
    /**
     * Timestamp when the incident was resolved. Empty while open.
     */
    resolvedAt?: string;
    /**
     * User or service account that resolved the incident. Empty for engine-internal resolves (boundary catches, modification cancel) and for open incidents.
     */
    resolvedBy?: string;
};
export namespace BpmnIncidentRecord {
    /**
     * Category of the error - same enum as `BpmnIncident.errorType`.
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

