/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for starting a new BPMN process instance.
 */
export type StartBpmnInstanceRequest = {
    /**
     * BPMN process ID of a deployed process to start.
     */
    processID: string;
    /**
     * Deployed version to start. Omit for the latest version.
     */
    version?: number;
    /**
     * Initial process variables. Available to FEEL expressions and service tasks from the first activity onward.
     */
    variables?: Record<string, any>;
    /**
     * Optional caller-supplied correlation key (order number, ticket ID, etc.) indexed for filtering and stamped on every child instance, external job, user task, and DMN execution emitted by this process.
     */
    businessId?: string;
};

