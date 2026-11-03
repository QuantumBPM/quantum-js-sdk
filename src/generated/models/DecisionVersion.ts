/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A deployed version of a decision.
 */
export type DecisionVersion = {
    /**
     * The decision's version, counted per decision id.
     */
    version: number;
    /**
     * Human-readable name of the decision in this version.
     */
    decisionName?: string;
    /**
     * Stable identifier of the DMN definition this version came from.
     */
    definitionsID: string;
    /**
     * The deployed version of that DMN definition.
     */
    definitionVersion: number;
    /**
     * When that DMN definition version was deployed.
     */
    deployedAt: string;
};

