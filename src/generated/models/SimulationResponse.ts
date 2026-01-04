/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvaluationResult } from './EvaluationResult';
export type SimulationResponse = {
    results?: Array<{
        executionId?: string;
        executedAt?: string;
        inputs?: Record<string, any>;
        results?: Record<string, EvaluationResult>;
    }>;
};

