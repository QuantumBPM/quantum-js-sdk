/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveScope } from './ActiveScope';
import type { BpmnIncident } from './BpmnIncident';
import type { SuspensionEntry } from './SuspensionEntry';
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
     * BPMN process definition ID this instance was started from.
     */
    processId?: string;
    /**
     * Version of the BPMN process definition this instance is currently running. Updated by migration operations.
     */
    processVersion?: number;
    /**
     * Current lifecycle status of the instance (e.g. RUNNING, COMPLETED, FAILED, TERMINATED).
     */
    status?: string;
    /**
     * All variables currently in scope for the root process.
     */
    variables?: Record<string, any>;
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
    /**
     * Present when this instance has been explicitly suspended by an
     * operator. Persisted across CaN rotations. Clear via the resume
     * instance endpoint. Composes with `definitionSuspension` — both must
     * be null for the instance to dispatch tokens.
     *
     */
    instanceSuspension?: SuspensionEntry;
    /**
     * Present when the instance's process definition has been suspended.
     * Clear via the resume definition endpoint (the backend fans out to
     * every running instance of the definition).
     *
     */
    definitionSuspension?: SuspensionEntry;
};

