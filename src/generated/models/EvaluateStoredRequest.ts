/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
export type EvaluateStoredRequest = {
    version?: number;
    context: FeelContext;
    /**
     * List of Decision Services to evaluate
     */
    decisionServices?: Array<string>;
    /**
     * List of Decision or Decision Service names to evaluate
     */
    decisions?: Array<string>;
};

