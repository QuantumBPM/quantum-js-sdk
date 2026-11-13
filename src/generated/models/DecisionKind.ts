/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Whether a deployed entry is a decision or a decision service. A BPMN
 * BusinessRuleTask calls either by its ID. A decision service returns its
 * output decision's value, or a context of them when it has several.
 *
 */
export enum DecisionKind {
    DECISION = 'DECISION',
    DECISION_SERVICE = 'DECISION_SERVICE',
}
