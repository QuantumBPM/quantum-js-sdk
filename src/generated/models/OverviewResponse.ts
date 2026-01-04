/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyStat } from './DailyStat';
import type { KpiTrend } from './KpiTrend';
export type OverviewResponse = {
    stats?: {
        totalRequests?: number;
        totalCredits?: number;
        requestsTrend?: Array<DailyStat>;
        creditsTrend?: Array<DailyStat>;
        kpiTrends?: Array<KpiTrend>;
    };
};

