/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DecisionInputField } from './DecisionInputField';
import type { DecisionKind } from './DecisionKind';
/**
 * A unique decision or decision service in the project, surfaced for picking from BPMN BusinessRuleTask elements.
 */
export type DecisionSummary = {
    /**
     * ID of the decision or decision service from the DMN XML (unique per project).
     */
    decisionID: string;
    /**
     * Human-readable name of the decision or decision service.
     */
    decisionName: string;
    kind: DecisionKind;
    /**
     * Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     */
    definitionsID: string;
    /**
     * Human-readable name of the DMN definition the latest version came from.
     */
    definitionName: string;
    /**
     * The decision's latest deployed version, counted per decision id. A business rule task that binds a version names this number.
     */
    latestVersion: number;
    /**
     * Declared input variables of the decision (from DMN `InformationRequirement` → `InputData`), or a decision service's parameters (its input data, then its input decisions). Useful for prepopulating BPMN BusinessRuleTask input mappings. Empty when none are declared.
     */
    inputFields: Array<DecisionInputField>;
};

