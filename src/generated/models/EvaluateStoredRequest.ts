/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
/**
 * Payload for evaluating a stored DMN definition.
 */
export type EvaluateStoredRequest = {
    /**
     * Specific definition version to evaluate. Defaults to the latest version.
     */
    version?: number;
    context: FeelContext;
    /**
     * Names of decision services to evaluate. If empty, no decision services are evaluated.
     */
    decisionServices?: Array<string>;
    /**
     * Names of decisions or decision services to evaluate. If empty, all decisions are evaluated.
     */
    decisions?: Array<string>;
    /**
     * Optional caller-supplied correlation key persisted with the resulting execution row for cross-system tracing.
     */
    businessId?: string;
};

