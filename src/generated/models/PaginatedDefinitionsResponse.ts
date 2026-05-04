/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Definition } from './Definition';
import type { PaginationMetadata } from './PaginationMetadata';
/**
 * Page of DMN definition versions.
 */
export type PaginatedDefinitionsResponse = {
    data: Array<Definition>;
    pagination: PaginationMetadata;
};

