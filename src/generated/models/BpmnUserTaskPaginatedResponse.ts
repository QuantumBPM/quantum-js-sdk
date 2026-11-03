/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CursorPage } from './CursorPage';
import type { UserTask } from './UserTask';
/**
 * Page of user tasks.
 */
export type BpmnUserTaskPaginatedResponse = {
    data: Array<UserTask>;
    pagination: CursorPage;
};

