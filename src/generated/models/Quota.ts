/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreditsQuota } from './CreditsQuota';
import type { DefinitionsQuota } from './DefinitionsQuota';
import type { QuotaItem } from './QuotaItem';
export type Quota = {
    /**
     * The ID of the current tier (e.g., developer, starter, scale)
     */
    tierId: string;
    credits?: CreditsQuota;
    history?: QuotaItem;
    projects?: QuotaItem;
    definitions?: DefinitionsQuota;
    users?: QuotaItem;
};

