/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Reassign a CREATED user task. All fields are optional but at least one
 * must be present, an empty body is rejected with 400. A field you leave out
 * keeps its value. A list you send replaces the stored one, so pass the full
 * set of candidateUsers / candidateGroups you want, not a delta.
 *
 */
export type UpdateUserTaskAssignmentRequest = {
    /**
     * New assignee. An empty string clears it.
     */
    assignee?: string;
    /**
     * Replaces the candidate users. An empty list clears them.
     */
    candidateUsers?: Array<string>;
    /**
     * Replaces the candidate groups. An empty list clears them.
     */
    candidateGroups?: Array<string>;
};

