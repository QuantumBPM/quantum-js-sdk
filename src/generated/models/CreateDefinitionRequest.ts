/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for creating a new DMN definition version.
 */
export type CreateDefinitionRequest = {
    /**
     * Display name.
     */
    name: string;
    /**
     * DMN XML body.
     */
    xml: string;
    /**
     * Optional explicit version number. If omitted, the server assigns one.
     */
    version?: number;
};

