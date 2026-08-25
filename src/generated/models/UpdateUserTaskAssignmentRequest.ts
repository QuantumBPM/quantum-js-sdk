/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Reassign a CREATED user task. All fields are optional but at least one
 * must be present. Fields are REPLACED atomically - pass the full set of
 * candidateUsers / candidateGroups you want stored, not a delta.
 *
 */
export type UpdateUserTaskAssignmentRequest = {
    /**
     * New assignee. Pass null to clear.
     */
    assignee?: string | null;
    candidateUsers?: Array<string>;
    candidateGroups?: Array<string>;
};

