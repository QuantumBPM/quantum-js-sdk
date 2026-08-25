/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelValue } from './FeelValue';
import type { HitRule } from './HitRule';
/**
 * Result of evaluating a single decision (or decision service / BKM / input data) within a DMN evaluation.
 */
export type EvaluationResult = {
    /**
     * ID of the decision element from the DMN XML.
     */
    decisionID?: string;
    /**
     * Human-readable name of the decision.
     */
    name?: string;
    /**
     * Error message if the decision failed to evaluate. Null on success.
     */
    error?: string | null;
    /**
     * Kind of DMN element that produced this result:
     * * `DECISION` - a decision node, the typical case.
     * * `DECISION_SERVICE` - a decision service that aggregates multiple decisions.
     * * `BKM` - a business knowledge model (reusable invocable logic).
     * * `INPUT_DATA` - an input variable, included for context, not evaluated.
     *
     */
    type?: EvaluationResult.type;
    value?: FeelValue;
    /**
     * For decision tables, the rules that matched. Empty for other decision logic.
     */
    hitRules?: Array<HitRule>;
    /**
     * Results of upstream decisions this decision required. Useful for tracing evaluation paths.
     */
    dependencies?: Array<EvaluationResult>;
};
export namespace EvaluationResult {
    /**
     * Kind of DMN element that produced this result:
     * * `DECISION` - a decision node, the typical case.
     * * `DECISION_SERVICE` - a decision service that aggregates multiple decisions.
     * * `BKM` - a business knowledge model (reusable invocable logic).
     * * `INPUT_DATA` - an input variable, included for context, not evaluated.
     *
     */
    export enum type {
        DECISION = 'DECISION',
        DECISION_SERVICE = 'DECISION_SERVICE',
        BKM = 'BKM',
        INPUT_DATA = 'INPUT_DATA',
    }
}

