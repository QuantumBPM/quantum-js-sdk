/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Execution } from './Execution';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of recorded DMN executions.
 */
export type PaginatedExecutionsResponse = {
    data: Array<Execution>;
    pagination: PaginationMetadata;
};

