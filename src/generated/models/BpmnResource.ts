/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A version of a BPMN resource (XML file containing one or more processes).
 */
export type BpmnResource = {
    /**
     * Platform identifier for this specific resource version.
     */
    id: string;
    /**
     * Display name.
     */
    name: string;
    /**
     * BPMN XML body.
     */
    xml: string;
    /**
     * Stable identifier from the BPMN XML's outer `<definitions id="…">` attribute. Shared across versions.
     */
    definitionsID: string;
    /**
     * True once the resource has been deployed and its processes are available to start instances.
     */
    isDeployed: boolean;
    /**
     * Timestamp when the resource was deployed. Empty for drafts.
     */
    deployedAt?: string;
    /**
     * User who uploaded this version.
     */
    createdBy: string;
    /**
     * Timestamp when this version was uploaded.
     */
    createdAt: string;
};

