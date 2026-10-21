/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorMode } from './ErrorMode';
import type { FeelContext } from './FeelContext';
/**
 * Payload for evaluating a stored DMN definition.
 */
export type EvaluateStoredRequest = {
    /**
     * Specific definition version to evaluate when evaluating by definitions id. Defaults to the
     * latest version. The `version` query parameter does the same, and a request giving both with
     * different values is rejected. Evaluating by definition UUID ignores it, as the UUID names one version.
     *
     */
    version?: number;
    context: FeelContext;
    errorMode?: ErrorMode;
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

