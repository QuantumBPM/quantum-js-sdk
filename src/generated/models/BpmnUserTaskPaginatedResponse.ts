/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationMetadata } from './PaginationMetadata';
import type { UserTask } from './UserTask';
/**
 * Page of user tasks.
 */
export type BpmnUserTaskPaginatedResponse = {
    data: Array<UserTask>;
    pagination: PaginationMetadata;
};

