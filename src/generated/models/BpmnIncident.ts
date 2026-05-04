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
     * Human-readable description of the error.
     */
    errorMessage?: string;
    /**
     * BPMN error code from the process definition; empty for non-BPMN errors.
     */
    errorCode?: string;
    /**
     * Category of the error. Values:
     * * `BpmnError` — A `bpmn:error` thrown by the process or an external job worker.
     * * `EscalationError` — A `bpmn:escalation` raised by the process.
     * * `CompensationError` — Failure during compensation handler execution.
     * * `FeelError` — A FEEL expression failed to evaluate.
     * * `NoHandler` — A thrown error/escalation has no matching catch event.
     * * `GatewayNoMatch` — An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` — A timer expression could not be parsed or resolved.
     * * `LinkNotFound` — A link throw event has no matching link catch.
     * * `MigrationError` — A process instance migration could not be applied.
     * * `Unknown` — Internal error not classified above.
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
     * * `BpmnError` — A `bpmn:error` thrown by the process or an external job worker.
     * * `EscalationError` — A `bpmn:escalation` raised by the process.
     * * `CompensationError` — Failure during compensation handler execution.
     * * `FeelError` — A FEEL expression failed to evaluate.
     * * `NoHandler` — A thrown error/escalation has no matching catch event.
     * * `GatewayNoMatch` — An exclusive gateway evaluated all conditions to false with no default flow.
     * * `TimerResolution` — A timer expression could not be parsed or resolved.
     * * `LinkNotFound` — A link throw event has no matching link catch.
     * * `MigrationError` — A process instance migration could not be applied.
     * * `Unknown` — Internal error not classified above.
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
        UNKNOWN = 'Unknown',
    }
}

