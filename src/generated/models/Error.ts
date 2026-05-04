/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A standard error response. The HTTP status code carries the broad category; `code` is the machine-readable identifier within that category.
 */
export type Error = {
    /**
     * Machine-readable error category. Values:
     * * `BAD_REQUEST` — request is malformed or fails validation.
     * * `UNAUTHORIZED` — request lacks or has an invalid authentication token.
     * * `FORBIDDEN` — caller is authenticated but lacks permission, or has hit a quota.
     * * `NOT_FOUND` — the addressed resource does not exist.
     * * `INTERNAL_ERROR` — unexpected server-side failure.
     *
     */
    code: Error.code;
    /**
     * Human-readable description of the failure.
     */
    message: string;
    /**
     * Optional structured context (e.g. the field that failed validation, the limit that was exceeded). Shape is per-error and not generally guaranteed.
     */
    details?: Record<string, any>;
};
export namespace Error {
    /**
     * Machine-readable error category. Values:
     * * `BAD_REQUEST` — request is malformed or fails validation.
     * * `UNAUTHORIZED` — request lacks or has an invalid authentication token.
     * * `FORBIDDEN` — caller is authenticated but lacks permission, or has hit a quota.
     * * `NOT_FOUND` — the addressed resource does not exist.
     * * `INTERNAL_ERROR` — unexpected server-side failure.
     *
     */
    export enum code {
        BAD_REQUEST = 'BAD_REQUEST',
        UNAUTHORIZED = 'UNAUTHORIZED',
        FORBIDDEN = 'FORBIDDEN',
        NOT_FOUND = 'NOT_FOUND',
        INTERNAL_ERROR = 'INTERNAL_ERROR',
    }
}

