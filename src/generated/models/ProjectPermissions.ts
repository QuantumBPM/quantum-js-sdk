/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectPermissions = {
    /**
     * Project role (admin, editor, executor, viewer)
     */
    role: string;
    can_manage_members: boolean;
    can_edit_definitions: boolean;
    can_execute: boolean;
    can_view: boolean;
};

