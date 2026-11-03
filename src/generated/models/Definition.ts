/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A saved DMN definition, a draft until it is deployed.
 */
export type Definition = {
    /**
     * Platform identifier of this saved definition.
     */
    id: string;
    /**
     * Human-readable name displayed in the UI.
     */
    name: string;
    /**
     * Stable identifier from the DMN XML's outer `<definitions id="…">` attribute. Shared across the definitions saved for one model.
     */
    definitionsID: string;
    /**
     * The DMN XML body.
     */
    xml: string;
    /**
     * True once the definition is deployed, which makes it read-only and its decisions evaluable.
     */
    isDeployed: boolean;
    /**
     * The version its deploy gave it, counted per `definitionsID`. Absent on a draft.
     */
    version?: number;
    /**
     * Timestamp of the deploy. Absent on a draft.
     */
    deployedAt?: string;
    /**
     * User who saved this definition.
     */
    createdBy?: string;
    /**
     * Timestamp of the last save.
     */
    createdAt: string;
    /**
     * How many definitions are saved under this `definitionsID`. Populated by the latest-listing endpoint and absent on single reads.
     */
    versionCount?: number;
};

