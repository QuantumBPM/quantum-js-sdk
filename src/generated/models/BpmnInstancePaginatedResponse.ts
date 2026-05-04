/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnInstance } from './BpmnInstance';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of BPMN process instances.
 */
export type BpmnInstancePaginatedResponse = {
    data: Array<BpmnInstance>;
    pagination: PaginationMetadata;
};

