/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Pagination metadata accompanying paginated list responses.
 */
export type PaginationMetadata = {
    /**
     * Current page number (1-indexed).
     */
    page: number;
    /**
     * Number of items per page.
     */
    pageSize: number;
    /**
     * Total number of items across all pages.
     */
    total: number;
    /**
     * Total number of pages.
     */
    totalPages: number;
};

