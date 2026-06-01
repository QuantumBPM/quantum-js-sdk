/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for starting a non-deployed BPMN process instance against a draft resource for testing.
 */
export type StartBpmnTestInstanceRequest = {
    /**
     * BPMN process ID (the `id` attribute on `<bpmn:process>`) to start. Defaults to the first executable process in the resource.
     */
    processID?: string;
    /**
     * Initial process variables.
     */
    variables?: Record<string, any>;
    /**
     * Optional caller-supplied correlation key.
     */
    businessId?: string;
};

