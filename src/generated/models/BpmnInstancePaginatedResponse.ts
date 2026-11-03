/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnInstance } from './BpmnInstance';
import type { CursorPage } from './CursorPage';
/**
 * Page of BPMN process instances.
 */
export type BpmnInstancePaginatedResponse = {
    data: Array<BpmnInstance>;
    pagination: CursorPage;
};

