/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
import type { FeelValue } from './FeelValue';
/**
 * A single recorded DMN evaluation against a stored definition.
 */
export type Execution = {
    /**
     * Unique identifier of this execution.
     */
    id: string;
    /**
     * Platform identifier of the definition version that was evaluated.
     */
    definitionID: string;
    /**
     * Timestamp when the evaluation ran.
     */
    executedAt: string;
    /**
     * User or service account that issued the evaluation.
     */
    executedBy?: string;
    inputs: FeelContext;
    outputs: FeelValue;
    /**
     * The DMN XML's `<definitions id="…">` value, useful for grouping executions across versions.
     */
    definitionsID?: string;
};

