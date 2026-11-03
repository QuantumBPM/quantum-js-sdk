/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * One deployed version of a process, with instance counts. `processID` and `version` address it.
 */
export type BpmnProcessVersion = {
    /**
     * BPMN resource version it was deployed from. Empty for a version deployed from no resource.
     */
    resourceID?: string;
    /**
     * Display name of that resource.
     */
    resourceName?: string;
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
     * User or service account that deployed this version.
     */
    deployedBy?: string;
    /**
     * Instances of this version with status RUNNING.
     */
    runningCount: number;
    /**
     * All instances of this version across statuses.
     */
    totalCount: number;
    /**
     * Timestamp at which this definition was paused. While set, the start
     * endpoint rejects new instances of this definition with 409, and every
     * already-running instance was sent a definition-scope suspend signal.
     * Empty when active.
     *
     */
    suspendedAt?: string;
    /**
     * Operator who suspended this definition. Empty when active.
     */
    suspendedBy?: string;
    /**
     * Free-text reason captured at suspend time.
     */
    suspendReason?: string;
};

