/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnResourceSummary } from './BpmnResourceSummary';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of BPMN resource summaries.
 */
export type BpmnResourceSummaryPaginatedResponse = {
    data: Array<BpmnResourceSummary>;
    pagination: PaginationMetadata;
};

