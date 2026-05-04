/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * One deployed version of a process, with instance counts.
 */
export type BpmnProcessVersion = {
    /**
     * Platform identifier of this process definition version. Use it to filter instances or as the source/target of a migration.
     */
    id: string;
    /**
     * Owning BPMN resource version.
     */
    resourceID: string;
    /**
     * Display name of the owning resource.
     */
    resourceName: string;
    /**
     * BPMN process id.
     */
    processID: string;
    /**
     * Human-readable process name.
     */
    processName: string;
    /**
     * Version number, starting at 1 for the first deploy.
     */
    version: number;
    /**
     * Timestamp when this version was deployed.
     */
    createdAt: string;
    /**
     * Instances of this version with status RUNNING.
     */
    runningCount: number;
    /**
     * All instances of this version across statuses.
     */
    totalCount: number;
};

