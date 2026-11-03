/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvaluationResult } from './EvaluationResult';
import type { FeelContext } from './FeelContext';
/**
 * A recorded evaluation of a deployed DMN definition, by `EvaluateByDefinitionsID` or by a
 * business rule task. A business rule task's names its instance, task and decision.
 *
 */
export type Execution = {
    /**
     * Unique identifier of this evaluation.
     */
    id: string;
    /**
     * The DMN XML's `<definitions id="…">` value.
     */
    definitionsID: string;
    /**
     * The deployed version of `definitionsID` that was evaluated.
     */
    version: number;
    /**
     * The decision a business rule task called. Absent on an evaluation through the API.
     */
    decisionID?: string;
    /**
     * The version of `decisionID` the business rule task called. Absent on an evaluation through the API.
     */
    decisionVersion?: number;
    /**
     * The process instance of the business rule task. Absent on an evaluation through the API.
     */
    instanceID?: string;
    /**
     * The business rule task's element id. Absent on an evaluation through the API.
     */
    nodeID?: string;
    /**
     * Timestamp when the evaluation ran.
     */
    executedAt: string;
    /**
     * User or service account that issued the evaluation. Absent on a business rule task's.
     */
    executedBy?: string;
    inputs: FeelContext;
    /**
     * Each evaluated decision's result, by decision name.
     */
    outputs: Record<string, EvaluationResult>;
    /**
     * Caller-supplied correlation key passed at evaluation time (REST) or inherited from the parent BPMN process (business rule task).
     */
    businessId?: string;
};

