/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveScope } from './ActiveScope';
import type { BpmnActivityState } from './BpmnActivityState';
import type { BpmnIncident } from './BpmnIncident';
/**
 * Full runtime state of a BPMN process instance.
 */
export type BpmnInstanceState = {
    /**
     * ID of the BPMN resource (definition file) that produced this instance.
     */
    resourceID: string;
    /**
     * Execution identifier for this instance.
     */
    workflowID?: string;
    /**
     * Execution identifier of the parent instance that started this one via a CallActivity. Empty for top-level instances.
     */
    parentWorkflowID?: string;
    /**
     * Current lifecycle status of the instance (e.g. RUNNING, COMPLETED, FAILED, TERMINATED).
     */
    status?: string;
    /**
     * All variables currently in scope for the root process.
     */
    variables?: Record<string, any>;
    /**
     * Ordered list of activity execution records.
     */
    history?: Array<BpmnActivityState>;
    /**
     * True when the instance has an unresolved incident.
     */
    error?: boolean;
    /**
     * Active incidents that require resolution before the process can continue.
     */
    incidents?: Array<BpmnIncident>;
    /**
     * Scopes that currently hold at least one live token.
     */
    activeScopes?: Array<ActiveScope>;
    /**
     * Error message from the workflow when status is FAILED.
     */
    failureReason?: string;
};

