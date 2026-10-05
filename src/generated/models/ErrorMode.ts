/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * How the evaluation reacts to FEEL errors and failing decisions (DMN 1.5, section 7.3.8):
 * * `strict` - the evaluation stops at the first error and the call reports it, with the
 * line and column where the failing part of the expression starts.
 * * `lenient` - a FEEL runtime error such as `string length(null)` makes only that part of
 * the expression `null` and is listed in the `warnings` of the decision's result. A
 * decision that still fails evaluates to `null` and carries its message in the `error`
 * field of its own result, while the decisions around it keep evaluating.
 * Omit it to use the mode the server is configured with.
 *
 */
export enum ErrorMode {
    STRICT = 'strict',
    LENIENT = 'lenient',
}
