/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnIncidentRecord } from './BpmnIncidentRecord';
import type { CursorPage } from './CursorPage';
/**
 * Page of persisted incidents.
 */
export type BpmnIncidentRecordPaginatedResponse = {
    data: Array<BpmnIncidentRecord>;
    pagination: CursorPage;
};

