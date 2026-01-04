/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelValue } from './FeelValue';
import type { HitRule } from './HitRule';
export type EvaluationResult = {
    decisionId?: string;
    name?: string;
    error?: string | null;
    type?: EvaluationResult.type;
    value?: FeelValue;
    hitRules?: Array<HitRule>;
    dependencies?: Array<EvaluationResult>;
};
export namespace EvaluationResult {
    export enum type {
        DECISION = 'DECISION',
        KPI = 'KPI',
        DECISION_SERVICE = 'DECISION_SERVICE',
        BKM = 'BKM',
        INPUT_DATA = 'INPUT_DATA',
    }
}

