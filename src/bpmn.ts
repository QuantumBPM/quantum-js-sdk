import { RawClient } from './generated/RawClient';
import { BpmnInstancePaginatedResponse } from './generated/models/BpmnInstancePaginatedResponse';
import { BpmnInstanceChildrenResponse } from './generated/models/BpmnInstanceChildrenResponse';
import { BpmnInstanceState } from './generated/models/BpmnInstanceState';
import { BpmnProcessSummaryPaginatedResponse } from './generated/models/BpmnProcessSummaryPaginatedResponse';
import { BpmnProcessVersionPaginatedResponse } from './generated/models/BpmnProcessVersionPaginatedResponse';
import { BpmnResourceDetail } from './generated/models/BpmnResourceDetail';
import { BpmnResourcePaginatedResponse } from './generated/models/BpmnResourcePaginatedResponse';
import { BpmnResourceSummaryPaginatedResponse } from './generated/models/BpmnResourceSummaryPaginatedResponse';
import { BpmnUserTaskPaginatedResponse } from './generated/models/BpmnUserTaskPaginatedResponse';
import { BpmnValidateResponse } from './generated/models/BpmnValidateResponse';
import { CorrelationKeys } from './generated/models/CorrelationKeys';
import { UpdateUserTaskAssignmentRequest } from './generated/models/UpdateUserTaskAssignmentRequest';
import { UserTask } from './generated/models/UserTask';

import { Vars } from './variables';

/** Re-exported entity types so callers don't depend on the generated package. */
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
};

export interface PageOptions {
    page?: number;
    pageSize?: number;
}

export interface InstanceListOptions extends PageOptions {
    definitionId?: string;
    status?: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
    /**
     * Filter by incident presence. `true` shows only instances that
     * need operator attention; `false` excludes them; omit for all.
     */
    hasIncident?: boolean;
    /**
     * Filter by suspension state. `true` shows only suspended
     * instances; `false` excludes them; omit for all.
     */
    suspended?: boolean;
    /**
     * Lower bound on the instance's createdAt timestamp (RFC 3339).
     * Useful for incremental pagination over recent activity.
     */
    createdAfter?: string;
    /**
     * Exact-match filter on the caller-supplied correlation key set
     * at startInstance time.
     */
    businessId?: string;
}

export interface UserTaskListOptions extends PageOptions {
    workflowId?: string;
    status?: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED';
    assignee?: string;
    candidateUser?: string;
    candidateGroup?: string;
    /**
     * Exact-match filter on the originating instance's
     * caller-supplied correlation key.
     */
    businessId?: string;
}

export interface StartInstanceOptions {
    /**
     * Caller-supplied correlation key (order number, ticket ID, etc.).
     * Stamped on every child instance, external job, user task, and
     * DMN execution emitted by the resulting process.
     */
    businessId?: string;
}

export interface ProcessListOptions extends PageOptions {
    /** Case-insensitive substring match against process id or name. */
    search?: string;
    /** ISO 8601 timestamp; bounds the totalCount aggregate. */
    createdAfter?: string;
}

export interface MessageOptions {
    /**
     * Routes the message to subscriptions whose stored correlation values
     * match these keys. Without it, the message broadcasts to subscriptions
     * with no correlation requirement.
     */
    correlationKeys?: CorrelationKeys;
    /** Buffered message lifetime - ISO 8601 duration, Go duration, or RFC 3339 timestamp. */
    ttl?: string;
}

export interface SignalOptions {
    /** Buffered signal lifetime - see MessageOptions.ttl. */
    ttl?: string;
}

/**
 * BpmnClient covers the BPMN runtime endpoints - resources, instances,
 * messaging, user tasks, and process discovery - for a single project.
 */
export class BpmnClient {
    constructor(
        private readonly raw: RawClient,
        private readonly projectId: string,
    ) {}

    // --- Resources ----------------------------------------------------------

    /** Stage a draft BPMN resource. Use deployResource() to make it executable. */
    async createResource(name: string, xml: string): Promise<BpmnResourceDetail> {
        return this.raw.bpmn.createBpmnResource(this.projectId, { name, xml });
    }

    /** Replace an existing draft resource's name and XML. */
    async updateResource(resourceId: string, name: string, xml: string): Promise<BpmnResourceDetail> {
        return this.raw.bpmn.updateBpmnResource(this.projectId, resourceId, { name, xml });
    }

    /** Delete a draft resource. */
    async deleteResource(resourceId: string): Promise<void> {
        await this.raw.bpmn.deleteBpmnResource(this.projectId, resourceId);
    }

    /** Fetch a resource (including XML and parsed processes) by UUID. */
    async getResource(resourceId: string): Promise<BpmnResourceDetail> {
        return this.raw.bpmn.getBpmnResource(this.projectId, resourceId);
    }

    /**
     * Promote a draft to a deployed process definition. After this returns,
     * the resource's `processes` field is populated and StartInstance can
     * reference the resulting process definition IDs.
     */
    async deployResource(resourceId: string): Promise<void> {
        await this.raw.bpmn.deployBpmnResource(this.projectId, resourceId);
    }

    /** Start a non-deployed instance against a draft for testing. */
    async startTestInstance(resourceId: string, vars: Vars, processId?: string, opts: StartInstanceOptions = {}): Promise<string> {
        const resp = await this.raw.bpmn.startBpmnTestInstance(this.projectId, resourceId, {
            processID: processId,
            variables: vars.toWireMap() as any,
            businessId: opts.businessId,
        });
        if (!resp.workflowID) {
            throw new Error('bpmn: startTestInstance returned no workflowID');
        }
        return resp.workflowID;
    }

    /** Lint a BPMN XML document without storing or deploying it. */
    async validateXml(xml: string): Promise<BpmnValidateResponse> {
        return this.raw.bpmn.validateBpmnXml(this.projectId, { xml });
    }

    /** Page through every resource version in the project. */
    async listResources(opts: PageOptions = {}): Promise<BpmnResourcePaginatedResponse> {
        return this.raw.bpmn.listBpmnResources(this.projectId, opts.page, opts.pageSize);
    }

    /** One row per definitions ID, showing the latest stored version. */
    async listLatestResources(opts: PageOptions = {}): Promise<BpmnResourceSummaryPaginatedResponse> {
        return this.raw.bpmn.listLatestBpmnResources(this.projectId, opts.page, opts.pageSize);
    }

    /** Every stored version for a given definitions ID. */
    async listResourceVersions(definitionsId: string, opts: PageOptions = {}): Promise<BpmnResourcePaginatedResponse> {
        return this.raw.bpmn.listBpmnResourcesByDefinitionsId(this.projectId, definitionsId, opts.page, opts.pageSize);
    }

    // --- Instances ----------------------------------------------------------

    /** Launch a new instance. Returns the workflowID. */
    async startInstance(processDefinitionId: string, vars: Vars, opts: StartInstanceOptions = {}): Promise<string> {
        const resp = await this.raw.default.startBpmnInstance(this.projectId, {
            processDefinitionID: processDefinitionId,
            variables: vars.toWireMap() as any,
            businessId: opts.businessId,
        });
        if (!resp.workflowID) {
            throw new Error('bpmn: startInstance returned no workflowID');
        }
        return resp.workflowID;
    }

    /** Full runtime state of an instance. */
    async getInstance(workflowId: string): Promise<BpmnInstanceState> {
        return this.raw.default.getBpmnInstance(this.projectId, workflowId);
    }

    /** Terminate a running instance. */
    async cancelInstance(workflowId: string): Promise<void> {
        await this.raw.default.cancelBpmnInstance(this.projectId, workflowId);
    }

    /** Page of instances in the project. */
    async listInstances(opts: InstanceListOptions = {}): Promise<BpmnInstancePaginatedResponse> {
        // Generated signature order: (projectId, definitionId, status,
        // hasIncident, suspended, createdAfter, businessId, page, pageSize).
        // Positional call - keep the order in sync with the regenerated client.
        return this.raw.default.listBpmnInstances(
            this.projectId,
            opts.definitionId,
            opts.status,
            opts.hasIncident,
            opts.suspended,
            opts.createdAfter,
            opts.businessId,
            opts.page,
            opts.pageSize,
        );
    }

    /** Children spawned via CallActivity. */
    async getInstanceChildren(workflowId: string): Promise<BpmnInstanceChildrenResponse> {
        return this.raw.bpmn.getBpmnInstanceChildren(this.projectId, workflowId);
    }

    /** Current variables of an instance. */
    async getInstanceVariables(workflowId: string): Promise<Vars> {
        const resp = await this.raw.bpmn.getBpmnInstanceVariables(this.projectId, workflowId);
        return Vars.fromWireMap(resp.variables);
    }

    /** Merge variables into the instance scope. */
    async updateInstanceVariables(workflowId: string, vars: Vars): Promise<void> {
        await this.raw.bpmn.updateBpmnInstanceVariables(this.projectId, workflowId, {
            variables: (vars.toWireMap() ?? {}) as any,
        });
    }

    /** Resolve an incident, optionally merging supplementary variables. */
    async resolveIncident(workflowId: string, incidentId: string, vars: Vars = new Vars()): Promise<void> {
        await this.raw.bpmn.resolveBpmnIncident(this.projectId, workflowId, incidentId, {
            variables: vars.toWireMap() as any,
        });
    }

    // --- Messaging ----------------------------------------------------------

    async publishMessage(name: string, vars: Vars = new Vars(), opts: MessageOptions = {}): Promise<void> {
        await this.raw.bpmn.publishBpmnMessage(this.projectId, {
            messageName: name,
            correlationKeys: opts.correlationKeys,
            ttl: opts.ttl,
            variables: vars.toWireMap() as any,
        });
    }

    async publishSignal(name: string, vars: Vars = new Vars(), opts: SignalOptions = {}): Promise<void> {
        await this.raw.bpmn.publishBpmnSignal(this.projectId, {
            signalName: name,
            ttl: opts.ttl,
            variables: vars.toWireMap() as any,
        });
    }

    // --- User tasks ---------------------------------------------------------

    async listUserTasks(opts: UserTaskListOptions = {}): Promise<BpmnUserTaskPaginatedResponse> {
        return this.raw.bpmn.listBpmnUserTasks(
            this.projectId,
            opts.workflowId,
            opts.status,
            opts.assignee,
            opts.candidateUser,
            opts.candidateGroup,
            opts.businessId,
            opts.page,
            opts.pageSize,
        );
    }

    /** User tasks the caller may claim or has already claimed. */
    async listUserTasksForCaller(opts: PageOptions = {}): Promise<BpmnUserTaskPaginatedResponse> {
        return this.raw.bpmn.listBpmnUserTasksForCaller(this.projectId, opts.page, opts.pageSize);
    }

    async getUserTask(executionKey: string): Promise<UserTask> {
        return this.raw.bpmn.getBpmnUserTask(this.projectId, executionKey);
    }

    async updateUserTaskAssignment(executionKey: string, body: UpdateUserTaskAssignmentRequest): Promise<UserTask> {
        return this.raw.bpmn.updateBpmnUserTaskAssignment(this.projectId, executionKey, body);
    }

    async completeUserTask(executionKey: string, vars: Vars = new Vars()): Promise<void> {
        await this.raw.bpmn.completeBpmnUserTask(this.projectId, executionKey, {
            variables: vars.toWireMap() as any,
        });
    }

    async throwUserTaskError(executionKey: string, errorCode: string, vars: Vars = new Vars()): Promise<void> {
        await this.raw.bpmn.throwBpmnUserTaskError(this.projectId, executionKey, {
            errorCode,
            variables: vars.toWireMap() as any,
        });
    }

    // --- Processes ----------------------------------------------------------

    async listProcesses(opts: ProcessListOptions = {}): Promise<BpmnProcessSummaryPaginatedResponse> {
        return this.raw.bpmn.listBpmnProcesses(
            this.projectId,
            opts.page,
            opts.pageSize,
            opts.search,
            opts.createdAfter,
        );
    }

    async listProcessVersions(processId: string, opts: ProcessListOptions = {}): Promise<BpmnProcessVersionPaginatedResponse> {
        return this.raw.bpmn.listBpmnProcessVersions(
            this.projectId,
            processId,
            opts.page,
            opts.pageSize,
            opts.createdAfter,
        );
    }
}
