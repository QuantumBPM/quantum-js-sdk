/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A workspace that groups DMN definitions and BPMN processes together for access control and execution.
 */
export type Project = {
    /**
     * Unique project identifier.
     */
    id: string;
    /**
     * Human-readable project name.
     */
    name: string;
    /**
     * Timestamp when the project was created.
     */
    createdAt: string;
    /**
     * Timestamp of the last modification.
     */
    updatedAt?: string;
};

