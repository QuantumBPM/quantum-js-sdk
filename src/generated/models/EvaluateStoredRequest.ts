/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorMode } from './ErrorMode';
import type { FeelContext } from './FeelContext';
/**
 * Payload for evaluating a deployed DMN definition.
 */
export type EvaluateStoredRequest = {
    /**
     * Deployed version to evaluate, the latest when omitted. The `version` query parameter does
     * the same, and a request giving both with different values is rejected.
     *
     */
    version?: number;
    context: FeelContext;
    errorMode?: ErrorMode;
    /**
     * Names of decision services to evaluate. When given, `decisions` is ignored.
     */
    decisionServices?: Array<string>;
    /**
     * Names of decisions or decision services to evaluate. If empty, all decisions are evaluated.
     */
    decisions?: Array<string>;
    /**
     * Optional caller-supplied correlation key recorded with the evaluation for cross-system tracing.
     */
    businessId?: string;
};

