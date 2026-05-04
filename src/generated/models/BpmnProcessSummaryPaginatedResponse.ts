/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnProcessSummary } from './BpmnProcessSummary';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of process summaries.
 */
export type BpmnProcessSummaryPaginatedResponse = {
    data: Array<BpmnProcessSummary>;
    pagination: PaginationMetadata;
};

