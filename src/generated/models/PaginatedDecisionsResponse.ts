/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DecisionSummary } from './DecisionSummary';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of decisions.
 */
export type PaginatedDecisionsResponse = {
    data: Array<DecisionSummary>;
    pagination: PaginationMetadata;
};

