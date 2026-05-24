/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Audit-shaped record of an active suspension at one scope (instance or
 * definition). Returned inline on `BpmnInstanceState` — `null` when not
 * suspended at that scope. An instance is "effectively suspended" if either
 * scope's entry is present; the dispatcher pauses forward token dispatch
 * while either flag is set.
 *
 */
export type SuspensionEntry = {
    /**
     * Unix epoch nanoseconds at which the suspension was applied.
     */
    suspendedAt: number;
    /**
     * Identifier of the operator (or service account) that initiated the suspension.
     */
    suspendedBy?: string;
    /**
     * Free-text reason captured at suspend time; surfaces in the operator UI alongside the action.
     */
    reason?: string;
};

