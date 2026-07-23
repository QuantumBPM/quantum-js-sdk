/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
/**
 * Payload for batch evaluating ad-hoc DMN XML against multiple input rows.
 */
export type BatchEvaluateDesignRequest = {
    /**
     * DMN XML to evaluate.
     */
    xml?: string;
    /**
     * One input context per row to evaluate. At most 500 rows per request.
     */
    inputs?: Array<FeelContext>;
};

