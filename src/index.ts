/**
 * QuantumBPM SDK - top-level entry point.
 *
 * @example
 * ```typescript
 * import { QuantumBPM, Vars, ZitadelTokenProvider } from '@quantumbpm/sdk';
 *
 * const provider = new ZitadelTokenProvider(keyPath, issuer, zitadelProjectId);
 * const client = new QuantumBPM({
 *   baseUrl: 'https://api.quantumbpm.com',
 *   projectId: '00000000-0000-0000-0000-000000000000',
 *   tokenProvider: provider,
 * });
 *
 * const result = await client.dmn.evaluate('loan-eligibility', new Vars().set('amount', 1000));
 * const wfId = await client.bpmn.startInstance(processDefId, new Vars());
 *
 * const ac = new AbortController();
 * const worker = client.newWorker({ clientId: 'billing-svc' });
 * worker.handle('send-email', async (job) => {
 *   await emailer.send(job.vars.lookup('recipient') as string);
 *   return new Vars().set('messageID', 'msg-123');
 * });
 * await worker.run(ac.signal);
 * ```
 */

import {
    TokenProvider,
    createAuthenticatedClient,
} from './auth';
import { BpmnClient } from './bpmn';
import { DmnClient } from './dmn';
import { RawClient } from './generated/RawClient';
import { Worker, WorkerConfig } from './workers';

export interface QuantumBPMConfig {
    /** API base URL (e.g. https://api.quantumbpm.com). */
    baseUrl: string;
    /** Workspace the client is scoped to. All calls operate on this project. */
    projectId: string;
    /** Bearer-token provider invoked on every request. */
    tokenProvider: TokenProvider;
}

/**
 * QuantumBPM is the top-level SDK entry point. Construct one and reach the
 * sub-clients via .dmn, .bpmn, and .newWorker(...).
 */
export class QuantumBPM {
    /** Generated raw client. Use for endpoints not covered by the wrapper. */
    readonly raw: RawClient;
    /** DMN evaluation surface. */
    readonly dmn: DmnClient;
    /** BPMN runtime surface - resources, instances, messaging, user tasks. */
    readonly bpmn: BpmnClient;
    /** Project the client is bound to. */
    readonly projectId: string;

    constructor(config: QuantumBPMConfig) {
        if (!config.baseUrl) throw new Error('quantumbpm: baseUrl is required');
        if (!config.projectId) throw new Error('quantumbpm: projectId is required');
        if (!config.tokenProvider) throw new Error('quantumbpm: tokenProvider is required');

        this.raw = createAuthenticatedClient(config.baseUrl, config.tokenProvider);
        this.projectId = config.projectId;
        this.dmn = new DmnClient(this.raw, this.projectId);
        this.bpmn = new BpmnClient(this.raw, this.projectId);
    }

    /**
     * Construct a worker bound to this client's project. Register handlers
     * via Worker.handle, then call Worker.run with an AbortSignal to start
     * polling.
     */
    newWorker(config: WorkerConfig = {}): Worker {
        return new Worker(this.raw, this.projectId, config);
    }
}

// Re-export the public surface so callers don't have to deep-import.
export { Vars } from './variables';
export {
    TokenProvider,
    StaticTokenProvider,
    ZitadelTokenProvider,
    createAuthenticatedClient,
} from './auth';
export {
    DmnClient,
    DmnResult,
    BatchResult,
    EvaluateOptions,
    DesignOptions,
} from './dmn';
export {
    BpmnClient,
    PageOptions,
    InstanceListOptions,
    UserTaskListOptions,
    ProcessListOptions,
    MessageOptions,
    SignalOptions,
} from './bpmn';
export type {
    BpmnInstancePaginatedResponse,
    BpmnInstanceChildrenResponse,
    BpmnInstanceState,
    BpmnProcessSummaryPaginatedResponse,
    BpmnProcessVersionPaginatedResponse,
    BpmnResourceDetail,
    BpmnResourcePaginatedResponse,
    BpmnResourceSummaryPaginatedResponse,
    BpmnUserTaskPaginatedResponse,
    BpmnValidateResponse,
    CorrelationKeys,
    UpdateUserTaskAssignmentRequest,
    UserTask,
} from './bpmn';
export {
    Worker,
    BpmnError,
    Job,
    Handler,
    HandleOptions,
    WorkerConfig,
} from './workers';
export { RawClient } from './generated/RawClient';
