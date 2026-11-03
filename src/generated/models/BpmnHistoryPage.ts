/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnActivityState } from './BpmnActivityState';
/**
 * A window of an instance's BPMN history, oldest first. Its entries carry
 * no `inputs` or `outputs`. `total` is the entry count at the time of the
 * call, which is also the newest entry's `seq`. It grows while the
 * instance runs. New entries never reorder earlier ones.
 *
 */
export type BpmnHistoryPage = {
    items: Array<BpmnActivityState>;
    /**
     * Number of history entries at the time of the call.
     */
    total: number;
};

