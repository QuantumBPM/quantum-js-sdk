/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelContext } from './FeelContext';
import type { FeelValue } from './FeelValue';
export type Execution = {
    id: string;
    definition_id: string;
    executed_at: string;
    executed_by?: string;
    inputs: FeelContext;
    outputs: FeelValue;
    xml_definition_id?: string;
};

