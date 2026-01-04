/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimulationRequest = {
    /**
     * The DMN XML definition to use for simulation
     */
    xml: string;
    /**
     * Filter historical executions after this date (ISO 8601). If not provided, defaults to 24h.
     */
    startDate?: string;
};

