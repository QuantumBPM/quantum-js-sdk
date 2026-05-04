/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Aggregated counts for a process across all of its deployed versions.
 */
export type BpmnProcessSummary = {
    /**
     * BPMN process id.
     */
    processID: string;
    /**
     * Human-readable process name.
     */
    processName: string;
    /**
     * Number of deployed versions of this process.
     */
    versionCount: number;
    /**
     * Instances with status RUNNING across all versions.
     */
    runningCount: number;
    /**
     * All instances across all versions.
     */
    totalCount: number;
};

