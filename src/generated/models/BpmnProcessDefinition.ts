/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A deployed process version from a BPMN resource. `processID` and `version` address it.
 */
export type BpmnProcessDefinition = {
    /**
     * Platform identifier of the owning BPMN resource.
     */
    resourceID: string;
    /**
     * BPMN `id` attribute on the `<process>` element.
     */
    processID: string;
    /**
     * Human-readable name from the BPMN XML.
     */
    processName?: string;
    /**
     * Process version. Auto-incremented per `processID` on deploy.
     */
    version: number;
    /**
     * Timestamp when this version became available.
     */
    createdAt: string;
    /**
     * User or service account that deployed this version.
     */
    deployedBy?: string;
    /**
     * Timestamp at which this process definition was paused. Empty when active.
     */
    suspendedAt?: string;
    /**
     * Free-text reason captured at suspend time.
     */
    suspendReason?: string;
};

