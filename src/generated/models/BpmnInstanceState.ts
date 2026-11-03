/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActiveScope } from './ActiveScope';
import type { BpmnElementStatistics } from './BpmnElementStatistics';
import type { BpmnIncident } from './BpmnIncident';
import type { BpmnInstanceStatus } from './BpmnInstanceStatus';
import type { JoinArrivals } from './JoinArrivals';
import type { SuspensionEntry } from './SuspensionEntry';
/**
 * Full runtime state of a BPMN process instance.
 */
export type BpmnInstanceState = {
    /**
     * ID of the BPMN resource the instance's process version was deployed from. Empty for a version deployed from no resource.
     */
    resourceID?: string;
    /**
     * Identifier of this instance.
     */
    instanceID: string;
    /**
     * Identifier of the parent instance that started this one via a CallActivity. Empty for top-level instances.
     */
    parentInstanceID?: string;
    /**
     * User or service account that started the instance. For an instance a message or signal started, its publisher. Empty for a timer start or a call-activity child.
     */
    startedBy?: string;
    /**
     * BPMN process definition ID this instance was started from.
     */
    processId?: string;
    /**
     * Version of the BPMN process definition this instance is currently running. Updated by migration operations.
     */
    processVersion?: number;
    status?: BpmnInstanceStatus;
    /**
     * All variables currently in scope for the root process.
     */
    variables?: Record<string, any>;
    /**
     * True when the instance failed or has an unresolved incident.
     */
    error?: boolean;
    /**
     * True for a test run, see `StartBpmnTestInstance`. Messages and signals
     * reach it under their names with the `draft:` prefix.
     *
     */
    draft?: boolean;
    /**
     * Active incidents that require resolution before the process can
     * continue. Empty once the instance has finished: the incident list keeps
     * each one with `resolvedBy` set to `system:<status>`.
     *
     */
    incidents?: Array<BpmnIncident>;
    /**
     * Scopes that currently hold at least one live token.
     */
    activeScopes?: Array<ActiveScope>;
    /**
     * Error message of the instance when status is FAILED.
     */
    failureReason?: string;
    /**
     * Present when this instance has been explicitly suspended by an
     * operator. Clear via the resume instance endpoint. Composes with
     * `definitionSuspension` - both must be null for the instance to
     * dispatch tokens.
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
    /**
     * Present on a call-activity child while an instance above it in the
     * call chain is suspended, carrying that suspension. It clears when that
     * instance is resumed. A suspension of the child itself stays until the
     * child is resumed.
     *
     */
    parentSuspension?: SuspensionEntry;
    /**
     * Joins still waiting to fire, with the flows that have reached them.
     */
    pendingJoinArrivals?: Array<JoinArrivals>;
    /**
     * The whole history summarised per element ID, so a diagram can show what each element did without reading the history.
     */
    elementStatistics?: Record<string, BpmnElementStatistics>;
    /**
     * Sequence flows a token has taken, by flow ID.
     */
    takenFlows?: Array<string>;
    /**
     * Caller-supplied correlation key set when the instance was started.
     */
    businessId?: string;
};

