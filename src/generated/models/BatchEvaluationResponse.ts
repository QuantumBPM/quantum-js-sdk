/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EvaluationResult } from './EvaluationResult';
export type BatchEvaluationResponse = {
    results?: Array<{
        executionId?: string;
        inputs?: Record<string, any>;
        results?: Record<string, EvaluationResult>;
    }>;
};

