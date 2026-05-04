/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for updating metadata on an existing definition version.
 */
export type UpdateDefinitionRequest = {
    /**
     * Replacement XML. The `definitionsID` and `version` from the original are preserved.
     */
    xml?: string;
    /**
     * Optional explicit version override. Generally not used during update.
     */
    version?: number;
    /**
     * New display name.
     */
    name?: string;
};

