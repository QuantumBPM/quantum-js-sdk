/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelValue } from './FeelValue';
/**
 * A single rule that matched during decision-table evaluation.
 */
export type HitRule = {
    /**
     * ID of the matched rule from the DMN XML.
     */
    ruleID?: string;
    outputs?: FeelValue;
};

