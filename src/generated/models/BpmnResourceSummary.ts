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
     * True when any version under this `definitionsID` contains a paused
     * process definition - including older versions, since a pause on a
     * superseded version is exactly what's hard to find otherwise.
     *
     */
    hasSuspendedDefinition?: boolean;
    /**
     * Upload timestamp of the latest version.
     */
    createdAt: string;
};

