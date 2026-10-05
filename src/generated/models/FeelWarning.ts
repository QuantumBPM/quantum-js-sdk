/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A FEEL runtime error that lenient mode replaced with `null`.
 */
export type FeelWarning = {
    /**
     * What failed, for example `string length: argument cannot be null`.
     */
    message: string;
    /**
     * Line in the expression where the failing part starts. Absent when unknown.
     */
    line?: number;
    /**
     * Column in the expression where the failing part starts. Absent when unknown.
     */
    column?: number;
};

