/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
export type EvaluateStoredRequest = {
    version?: number;
    context: FeelContext;
    /**
     * Optional identifier for the business object being processed. If provided, existing metrics for this businessId and XML Definition ID will be replaced.
     */
    businessId?: string;
    /**
     * Names of the Decision Services to evaluate (optional)
     */
    decisionServices?: Array<string>;
    /**
     * List of Decision or Decision Service names to evaluate (optional)
     */
    decisions?: Array<string>;
};

