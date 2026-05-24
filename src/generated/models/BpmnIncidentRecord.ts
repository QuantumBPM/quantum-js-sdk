/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A persisted incident — the cross-instance audit row that backs the
 * "Incidents" view. The same incident is also available in
 * `BpmnInstanceState.incidents` while it is still open in the engine; the
 * persisted row additionally carries `raisedAt` / `resolvedAt` /
 * `resolvedBy` and the parent process metadata so it can be listed and
 * filtered without joining back to the instance.
 *
 */
export type BpmnIncidentRecord = {
    /**
     * Surrogate row identifier; stable across resolves.
     */
    id: string;
    /**
     * Engine-assigned incident identifier, unique within the workflow.
     */
    incidentID: string;
    /**
     * Identifier of the instance that produced the incident.
     */
    workflowID: string;
    /**
     * ID of the process definition the instance is running. May be absent when the source definition was deleted.
     */
    definitionID?: string;
    /**
     * BPMN process ID of the parent definition. Convenience field; absent when definitionID is unresolved.
     */
    processID?: string;
    /**
     * Human-readable name of the parent process definition.
     */
    processName?: string;
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
     * Category of the error — same enum as `BpmnIncident.errorType`.
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
     * Identifier of the user who resolved the incident, or "system:reconcile" when corrected by drift reconciliation. Empty for engine-internal resolves (boundary catches, modification cancel) and for open incidents.
     */
    resolvedBy?: string;
};
export namespace BpmnIncidentRecord {
    /**
     * Category of the error — same enum as `BpmnIncident.errorType`.
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
        UNKNOWN = 'Unknown',
    }
}

