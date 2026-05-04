/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Outcome of validating a migration plan without executing it.
 */
export type MigrationValidationResult = {
    /**
     * True when the plan can be applied as-is.
     */
    valid?: boolean;
    /**
     * Human-readable descriptions of problems that would prevent migration.
     */
    issues?: Array<string>;
};

