/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for updating an existing definition version.
 */
export type UpdateDefinitionRequest = {
    /**
     * Replacement XML. The `definitionsID` is read from its `<definitions id>`, falling back to the original.
     */
    xml?: string;
    /**
     * Omit to overwrite the version in place. 0 stores the change as the next version instead.
     */
    version?: number;
    /**
     * New display name.
     */
    name?: string;
};

