/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * One entry per BPMN definitionsID showing the latest version's metadata.
 */
export type BpmnResourceSummary = {
    /**
     * Stable BPMN definitions identifier.
     */
    definitionsID: string;
    /**
     * Platform identifier of the latest resource version under this `definitionsID`.
     */
    latestResourceID: string;
    /**
     * Display name from the latest version.
     */
    name: string;
    /**
     * Total number of stored versions for this `definitionsID`.
     */
    versionCount: number;
    /**
     * Whether the latest version is deployed.
     */
    isDeployed: boolean;
    /**
     * Upload timestamp of the latest version.
     */
    createdAt: string;
};

