/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for changing a draft DMN definition.
 */
export type UpdateDefinitionRequest = {
    /**
     * Replacement XML. The `definitionsID` is read from its `<definitions id>`, falling back to the original.
     */
    xml?: string;
    /**
     * New display name.
     */
    name?: string;
};

