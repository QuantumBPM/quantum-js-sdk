/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from './CursorPage';
import type { Execution } from './Execution';
/**
 * Page of recorded DMN executions.
 */
export type PaginatedExecutionsResponse = {
    data: Array<Execution>;
    pagination: CursorPage;
};

