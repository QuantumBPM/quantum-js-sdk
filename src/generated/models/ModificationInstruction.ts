/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A single token-level operation applied to a running instance during a modification.
 */
export type ModificationInstruction = {
    /**
     * Kind of operation:
     * * `START_BEFORE_NODE` — activate `nodeID` in the given scope, optionally seeding `variables` first.
     * * `CANCEL_TOKEN` — cancel the active token at `nodeID` in the given scope.
     *
     */
    type: ModificationInstruction.type;
    /**
     * BPMN flow node id the instruction targets.
     */
    nodeID: string;
    /**
     * Scope to apply the instruction in. Empty applies to the root process scope.
     */
    scopeID?: string;
    /**
     * Variables to inject into the scope for `START_BEFORE_NODE`.
     */
    variables?: Record<string, any>;
};
export namespace ModificationInstruction {
    /**
     * Kind of operation:
     * * `START_BEFORE_NODE` — activate `nodeID` in the given scope, optionally seeding `variables` first.
     * * `CANCEL_TOKEN` — cancel the active token at `nodeID` in the given scope.
     *
     */
    export enum type {
        START_BEFORE_NODE = 'START_BEFORE_NODE',
        CANCEL_TOKEN = 'CANCEL_TOKEN',
    }
}

