/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DecisionInputField } from './DecisionInputField';
/**
 * A unique decision in the project, surfaced for picking from BPMN BusinessRuleTask elements.
 */
export type DecisionSummary = {
    /**
     * ID of the decision node from the DMN XML (unique per project).
     */
    decisionID: string;
    /**
     * Human-readable name of the decision.
     */
    decisionName: string;
    /**
     * Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     */
    definitionsID: string;
    /**
     * Human-readable name of the parent DMN definition.
     */
    definitionName: string;
    /**
     * Highest deployed version that contains this decision.
     */
    latestVersion: number;
    /**
     * Declared input variables of the decision (from DMN `InformationRequirement` → `InputData`). Useful for prepopulating BPMN BusinessRuleTask input mappings. Empty when the decision declares no typed inputs.
     */
    inputFields: Array<DecisionInputField>;
};

