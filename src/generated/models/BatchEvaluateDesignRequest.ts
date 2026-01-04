/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BatchEvaluateDesignRequest = {
    /**
     * The DMN XML definition to evaluate
     */
    xml?: string;
    /**
     * List of input contexts (rows) to evaluate
     */
    inputs?: Array<Record<string, any>>;
};

