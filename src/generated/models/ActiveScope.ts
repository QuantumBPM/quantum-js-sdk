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
     * IDs of flow nodes that currently hold live tokens within this scope.
     */
    activeNodes?: Array<string>;
    /**
     * Version of the process definition active in this scope.
     */
    processVersion?: number;
    /**
     * Variables scoped to this instance, excluding inherited parent-scope variables.
     */
    variables?: Record<string, any>;
};

