import { RawClient } from './generated/RawClient';
import { BatchEvaluationResponse } from './generated/models/BatchEvaluationResponse';
import { EvaluationResult } from './generated/models/EvaluationResult';

import { Vars } from './variables';

/** Map of decision name → result, the standard DMN evaluation response shape. */
export type DmnResult = Record<string, EvaluationResult>;

/** Per-row results from EvaluateDesignBatch. */
export type BatchResult = BatchEvaluationResponse;

/** Options for stored DMN evaluations. */
export interface EvaluateOptions {
    /** Pin the evaluation to a specific definition version. */
    version?: number;
    /** Restrict evaluation to the named decisions. */
    decisions?: string[];
    /** Restrict evaluation to the named decision services. */
    decisionServices?: string[];
    /**
     * Caller-supplied correlation key persisted with the resulting
     * execution row for cross-system tracing.
     */
    businessId?: string;
}

/** Options for ad-hoc DMN evaluations. */
export interface DesignOptions {
    /** Restrict evaluation to the named decisions. */
    decisions?: string[];
    /** Restrict evaluation to the named decision services. */
    decisionServices?: string[];
    /** Additional DMN XML documents whose decisions can be imported. */
    additionalXMLs?: string[];
}

/** DmnClient evaluates DMN definitions in a single project. */
export class DmnClient {
    constructor(
        private readonly raw: RawClient,
        private readonly projectId: string,
    ) {}

    /**
     * Run a stored DMN definition identified by its DMN XML
     * `<definitions id="…">` value. This is the typical evaluation path —
     * stable across versions, addressable from the BPMN model.
     */
    async evaluate(
        definitionsId: string,
        vars: Vars,
        opts: EvaluateOptions = {},
    ): Promise<DmnResult> {
        return this.raw.default.evaluateByDefinitionsId(
            this.projectId,
            definitionsId,
            {
                context: vars.toFeelContext(),
                version: opts.version,
                decisions: opts.decisions,
                decisionServices: opts.decisionServices,
                businessId: opts.businessId,
            },
            opts.version,
        );
    }

    /**
     * Run a stored DMN definition addressed by its platform UUID. Prefer
     * evaluate() (by definitions ID) for normal use; this overload is for
     * callers that already hold a specific version pointer.
     */
    async evaluateById(
        definitionId: string,
        vars: Vars,
        opts: EvaluateOptions = {},
    ): Promise<DmnResult> {
        return this.raw.default.evaluateStored(this.projectId, definitionId, {
            context: vars.toFeelContext(),
            version: opts.version,
            decisions: opts.decisions,
            decisionServices: opts.decisionServices,
            businessId: opts.businessId,
        });
    }

    /** Run ad-hoc DMN XML against an input context. The XML is not stored. */
    async evaluateDesign(
        xml: string,
        vars: Vars,
        opts: DesignOptions = {},
    ): Promise<DmnResult> {
        return this.raw.default.evaluateDesign({
            xml,
            context: vars.toFeelContext(),
            decisions: opts.decisions,
            decisionServices: opts.decisionServices,
            additionalXMLs: opts.additionalXMLs,
        });
    }

    /** Evaluate the same XML against many input rows in one request. */
    async evaluateDesignBatch(xml: string, rows: Vars[]): Promise<BatchResult> {
        return this.raw.default.evaluateDesignBatch({
            xml,
            inputs: rows.map(r => r.toRecord()),
        });
    }
}
