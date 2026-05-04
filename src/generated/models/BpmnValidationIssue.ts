/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A single validation finding produced while parsing BPMN XML.
 */
export type BpmnValidationIssue = {
    /**
     * Severity of the issue. `error` blocks deploy; `warning` is informational.
     */
    severity: BpmnValidationIssue.severity;
    /**
     * ID of the BPMN element the issue is about. Empty for issues that aren't tied to a specific element.
     */
    elementID?: string;
    /**
     * Human-readable description of the issue.
     */
    message: string;
};
export namespace BpmnValidationIssue {
    /**
     * Severity of the issue. `error` blocks deploy; `warning` is informational.
     */
    export enum severity {
        ERROR = 'error',
        WARNING = 'warning',
    }
}

