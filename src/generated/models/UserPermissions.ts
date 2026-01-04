/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectPermissions } from './ProjectPermissions';
export type UserPermissions = {
    /**
     * User's global organization role (admin or user)
     */
    global_role: string;
    /**
     * Map of projectID to project permissions
     */
    projects: Record<string, ProjectPermissions>;
};

