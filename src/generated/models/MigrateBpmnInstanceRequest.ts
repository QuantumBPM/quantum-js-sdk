/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ElementMapping } from './ElementMapping';
/**
 * Payload for migrating a running instance to a different version of its process.
 */
export type MigrateBpmnInstanceRequest = {
    /**
     * Version of the same process to migrate to.
     */
    targetVersion: number;
    /**
     * Mappings for elements that have been renamed between versions. Elements with the same id in source and target are matched implicitly.
     */
    elementMappings?: Array<ElementMapping>;
    /**
     * Variables to merge into the instance scope as part of the migration. Useful for filling in inputs introduced in the target version.
     */
    variables?: Record<string, any>;
};

