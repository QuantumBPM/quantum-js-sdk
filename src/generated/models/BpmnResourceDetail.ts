/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnProcessDefinition } from './BpmnProcessDefinition';
import type { BpmnResource } from './BpmnResource';
/**
 * A BPMN resource together with the parsed processes it contains.
 */
export type BpmnResourceDetail = (BpmnResource & {
    /**
     * Parsed processes inside the resource. Empty for resources whose XML has not been deployed yet.
     */
    processes?: Array<BpmnProcessDefinition>;
});

