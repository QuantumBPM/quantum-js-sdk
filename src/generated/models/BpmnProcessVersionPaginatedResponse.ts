/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnProcessVersion } from './BpmnProcessVersion';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of process version entries.
 */
export type BpmnProcessVersionPaginatedResponse = {
    data: Array<BpmnProcessVersion>;
    pagination: PaginationMetadata;
};

