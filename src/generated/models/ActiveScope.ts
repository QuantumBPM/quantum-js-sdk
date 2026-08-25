/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A scope (sub-process, multi-instance body, or root process) that currently holds at least one live execution token.
 */
export type ActiveScope = {
    /**
     * Unique identifier of this scope instance.
     */
    scopeID?: string;
    /**
     * ID of the parent scope, empty for the root scope.
     */
    parentScopeID?: string;
    /**
     * ID of the BPMN element that created this scope (e.g. a sub-process node). Empty for the root scope.
     */
    nodeID?: string;
    /**
     * Live token count per flow node in this scope, keyed by node ID. A node can hold more than one token at a time (a parallel fork whose branches re-converge without a join, a non-interrupting boundary handler, a loop edge re-entering a node a prior token has not left yet), so the count matters: a presence-only list cannot tell one token from five. Absent keys mean no live token.
     */
    activeNodes?: Record<string, number>;
    /**
     * Version of the process definition active in this scope.
     */
    processVersion?: number;
    /**
     * Variables scoped to this instance, excluding inherited parent-scope variables.
     */
    variables?: Record<string, any>;
};

