/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnIncidentRecord } from './BpmnIncidentRecord';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of persisted incidents.
 */
export type BpmnIncidentRecordPaginatedResponse = {
    data: Array<BpmnIncidentRecord>;
    pagination: PaginationMetadata;
};

