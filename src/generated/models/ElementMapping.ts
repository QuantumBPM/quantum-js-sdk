/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Maps a BPMN flow node from the source process version to the corresponding node in the target version during migration.
 */
export type ElementMapping = {
    /**
     * BPMN element id in the running instance's current process version.
     */
    sourceElementID: string;
    /**
     * BPMN element id in the target process version.
     */
    targetElementID: string;
};

