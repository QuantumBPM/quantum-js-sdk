/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvaluationResult } from './EvaluationResult';
/**
 * Per-row results from a batch evaluation.
 */
export type BatchEvaluationResponse = {
    results?: Array<{
        /**
         * Identifier assigned to this row's evaluation, useful for correlating with logs.
         */
        executionID?: string;
        /**
         * The input row that produced these results, echoed for convenience.
         */
        inputs?: Record<string, any>;
        /**
         * Evaluation results keyed by decision name.
         */
        results?: Record<string, EvaluationResult>;
    }>;
};

