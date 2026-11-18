import { RawClient } from './generated/RawClient';
import { BatchEvaluationResponse } from './generated/models/BatchEvaluationResponse';
import { Definition } from './generated/models/Definition';
import { EvaluationResult } from './generated/models/EvaluationResult';

import { Vars } from './variables';

export type { Definition };

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

/** DmnClient deploys and evaluates DMN definitions in a single project. */
export class DmnClient {
    constructor(
        private readonly raw: RawClient,
        private readonly projectId: string,
    ) {}

    /**
     * Save DMN XML as a draft, which is not evaluable until deployDefinition()
     * deploys it. XML identical to the latest deployed version of its
     * `<definitions id>` is refused with 409.
     */
    async createDefinition(name: string, xml: string): Promise<Definition> {
        return this.raw.default.createDefinition(this.projectId, { name, xml });
    }

    /**
     * Deploy a draft and return it with the version it got. A draft identical
     * to the latest deployed version is refused with 409.
     */
    async deployDefinition(definitionId: string): Promise<Definition> {
        return this.raw.default.deployDefinition(this.projectId, definitionId);
    }

    /**
     * Run a stored DMN definition identified by its DMN XML
     * `<definitions id="…">` value. This is the typical evaluation path -
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
