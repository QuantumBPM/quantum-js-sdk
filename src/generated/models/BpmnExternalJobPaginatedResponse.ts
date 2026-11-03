/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from './CursorPage';
import type { ExternalJob } from './ExternalJob';
/**
 * Page of external jobs.
 */
export type BpmnExternalJobPaginatedResponse = {
    data: Array<ExternalJob>;
    pagination: CursorPage;
};

