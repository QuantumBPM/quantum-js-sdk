/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnResource } from './BpmnResource';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of BPMN resource versions.
 */
export type BpmnResourcePaginatedResponse = {
    data: Array<BpmnResource>;
    pagination: PaginationMetadata;
};

