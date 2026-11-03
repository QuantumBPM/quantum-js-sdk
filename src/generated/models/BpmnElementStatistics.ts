/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * What an instance's history recorded for one element.
 */
export type BpmnElementStatistics = {
    /**
     * Times the element completed.
     */
    completed?: number;
    /**
     * Times the element failed.
     */
    failed?: number;
    /**
     * Times the element was canceled.
     */
    canceled?: number;
    /**
     * The element's latest Completed, Failed, Canceled or Resolved entry.
     */
    lastStatus?: BpmnElementStatistics.lastStatus;
    /**
     * For a call activity, the child its latest execution started.
     */
    childInstanceID?: string;
};
export namespace BpmnElementStatistics {
    /**
     * The element's latest Completed, Failed, Canceled or Resolved entry.
     */
    export enum lastStatus {
        COMPLETED = 'Completed',
        FAILED = 'Failed',
        CANCELED = 'Canceled',
        RESOLVED = 'Resolved',
    }
}

