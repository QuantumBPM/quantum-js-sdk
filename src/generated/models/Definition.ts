/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A stored DMN definition. Each call to CreateDefinition produces a new version of a `definitionsID`.
 */
export type Definition = {
    /**
     * Platform identifier for this specific definition version.
     */
    id: string;
    /**
     * Human-readable name displayed in the UI.
     */
    name: string;
    /**
     * Stable identifier from the DMN XML's outer `<definitions id="…">` attribute. Shared across versions.
     */
    definitionsID: string;
    /**
     * The DMN XML body.
     */
    xml: string;
    /**
     * Auto-incremented version number, starting at 1 for the first upload of a `definitionsID`.
     */
    version: number;
    /**
     * User who uploaded this version.
     */
    createdBy?: string;
    /**
     * Timestamp when this version was uploaded.
     */
    createdAt: string;
};

