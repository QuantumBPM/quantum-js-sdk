/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnValidationIssue } from './BpmnValidationIssue';
/**
 * Result of validating BPMN XML, separated into blocking errors and informational warnings.
 */
export type BpmnValidateResponse = {
    errors: Array<BpmnValidationIssue>;
    warnings: Array<BpmnValidationIssue>;
};

