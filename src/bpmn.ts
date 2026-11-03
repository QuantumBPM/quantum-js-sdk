import { RawClient } from './generated/RawClient';
import { BpmnActivityState } from './generated/models/BpmnActivityState';
import { BpmnHistoryPage } from './generated/models/BpmnHistoryPage';
import { BpmnInstancePaginatedResponse } from './generated/models/BpmnInstancePaginatedResponse';
import { BpmnInstanceChildrenResponse } from './generated/models/BpmnInstanceChildrenResponse';
import { BpmnInstanceState } from './generated/models/BpmnInstanceState';
import { BpmnProcessSummaryPaginatedResponse } from './generated/models/BpmnProcessSummaryPaginatedResponse';
import { BpmnProcessVersion } from './generated/models/BpmnProcessVersion';
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
    BpmnActivityState,
    BpmnHistoryPage,
    BpmnInstancePaginatedResponse,
    BpmnInstanceChildrenResponse,
    BpmnInstanceState,
    BpmnProcessSummaryPaginatedResponse,
    BpmnProcessVersion,
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

/** Paging of a list the API pages by cursor. */
export interface CursorOptions {
    /** The `pagination.nextCursor` of the page before, omitted for the first page. */
    cursor?: string;
    /** Most rows per page, 20 by default and 100 at most. */
    limit?: number;
}

export interface InstanceListOptions extends CursorOptions {
    /** Instances of every version of this process id, unless `version` names one. */
    processId?: string;
    /** Instances of this version of `processId`. Ignored without `processId`. */
    version?: number;
    status?: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'TERMINATED';
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
     * Prefix filter on the caller-supplied correlation key set
     * at startInstance time.
     */
    businessId?: string;
    /** `true` keeps only test runs, `false` leaves them out. Omit for both. */
    draft?: boolean;
}

/** The due date range and order of a user task list. */
export interface UserTaskScheduleOptions extends CursorOptions {
    /** Tasks due at or after this time (RFC 3339). */
    dueAfter?: string;
    /** Tasks due before this time (RFC 3339). With `status: 'CREATED'` and now, the overdue tasks. */
    dueBefore?: string;
    /**
     * `created` lists the newest first, the default. `dueDate` lists the
     * soonest due first, `priority` the highest priority first. A cursor
     * continues only a list of the same sort.
     */
    sort?: 'created' | 'dueDate' | 'priority';
}

export interface UserTaskListOptions extends UserTaskScheduleOptions {
    instanceId?: string;
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
    /** Deployed version to start, the latest when omitted. startTestInstance ignores it. */
    version?: number;
}

/** Which window of an instance's history to read. Omit both seqs for the newest entries. */
export interface HistoryOptions {
    /** Read the entries from this seq on, to follow a running instance. Takes precedence over `beforeSeq`. */
    fromSeq?: number;
    /** Read the newest entries before this seq, to walk back. */
    beforeSeq?: number;
    /** Most entries per page. */
    limit?: number;
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
     * Deploy a draft. After this returns, the resource's `processes` field
     * lists the process versions it deployed, and startInstance can start
     * them by process ID.
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
        if (!resp.instanceID) {
            throw new Error('bpmn: startTestInstance returned no instanceID');
        }
        return resp.instanceID;
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

    /**
     * Launch a new instance of a deployed process, its latest version unless
     * `opts.version` names one. Returns the instance ID.
     */
    async startInstance(processId: string, vars: Vars, opts: StartInstanceOptions = {}): Promise<string> {
        const resp = await this.raw.default.startBpmnInstance(this.projectId, {
            processID: processId,
            version: opts.version,
            variables: vars.toWireMap() as any,
            businessId: opts.businessId,
        });
        if (!resp.instanceID) {
            throw new Error('bpmn: startInstance returned no instanceID');
        }
        return resp.instanceID;
    }

    /** Full runtime state of an instance. */
    async getInstance(instanceId: string): Promise<BpmnInstanceState> {
        return this.raw.default.getBpmnInstance(this.projectId, instanceId);
    }

    /** Terminate a running instance. */
    async cancelInstance(instanceId: string): Promise<void> {
        await this.raw.default.cancelBpmnInstance(this.projectId, instanceId);
    }

    /**
     * Page of instances in the project, newest first. Pass the page's
     * `pagination.nextCursor` as `cursor` for the next one. It is absent on
     * the last page.
     */
    async listInstances(opts: InstanceListOptions = {}): Promise<BpmnInstancePaginatedResponse> {
        // Generated signature order: (projectId, status, hasIncident,
        // suspended, createdAfter, businessId, processId, version, draft,
        // cursor, limit). Positional call - keep the order in sync with the regenerated client.
        return this.raw.default.listBpmnInstances(
            this.projectId,
            opts.status,
            opts.hasIncident,
            opts.suspended,
            opts.createdAfter,
            opts.businessId,
            opts.processId,
            opts.version,
            opts.draft,
            opts.cursor,
            opts.limit,
        );
    }

    /** Children spawned via CallActivity. */
    async getInstanceChildren(instanceId: string): Promise<BpmnInstanceChildrenResponse> {
        return this.raw.bpmn.getBpmnInstanceChildren(this.projectId, instanceId);
    }

    /**
     * Page of an instance's history, oldest first, for a running or an ended
     * instance. Page entries leave out `inputs` and `outputs`, which
     * getInstanceHistoryEntry() reads.
     */
    async getInstanceHistory(instanceId: string, opts: HistoryOptions = {}): Promise<BpmnHistoryPage> {
        return this.raw.bpmn.getBpmnInstanceHistory(this.projectId, instanceId, opts.fromSeq, opts.beforeSeq, opts.limit);
    }

    /** One history entry with its inputs and outputs. */
    async getInstanceHistoryEntry(instanceId: string, seq: number): Promise<BpmnActivityState> {
        return this.raw.bpmn.getBpmnInstanceHistoryEntry(this.projectId, instanceId, seq);
    }

    /** Current variables of an instance. */
    async getInstanceVariables(instanceId: string): Promise<Vars> {
        const resp = await this.raw.bpmn.getBpmnInstanceVariables(this.projectId, instanceId);
        return Vars.fromWireMap(resp.variables);
    }

    /** Merge variables into the instance scope. */
    async updateInstanceVariables(instanceId: string, vars: Vars): Promise<void> {
        await this.raw.bpmn.updateBpmnInstanceVariables(this.projectId, instanceId, {
            variables: (vars.toWireMap() ?? {}) as any,
        });
    }

    /** Resolve an incident, optionally merging supplementary variables. */
    async resolveIncident(instanceId: string, incidentId: string, vars: Vars = new Vars()): Promise<void> {
        await this.raw.bpmn.resolveBpmnIncident(this.projectId, instanceId, incidentId, {
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

    /**
     * Page of user tasks in the project. Pass the page's
     * `pagination.nextCursor` as `cursor` for the next one.
     */
    async listUserTasks(opts: UserTaskListOptions = {}): Promise<BpmnUserTaskPaginatedResponse> {
        return this.raw.bpmn.listBpmnUserTasks(
            this.projectId,
            opts.instanceId,
            opts.status,
            opts.assignee,
            opts.candidateUser,
            opts.candidateGroup,
            opts.businessId,
            opts.dueAfter,
            opts.dueBefore,
            opts.sort,
            opts.cursor,
            opts.limit,
        );
    }

    /** Page of the user tasks the caller may claim or has already claimed. */
    async listUserTasksForCaller(opts: UserTaskScheduleOptions = {}): Promise<BpmnUserTaskPaginatedResponse> {
        return this.raw.bpmn.listBpmnUserTasksForCaller(
            this.projectId,
            opts.dueAfter,
            opts.dueBefore,
            opts.sort,
            opts.cursor,
            opts.limit,
        );
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

    /** One deployed version of a process id with its instance counts and suspension state. */
    async getProcessVersion(processId: string, version: number, opts: { createdAfter?: string } = {}): Promise<BpmnProcessVersion> {
        return this.raw.bpmn.getBpmnProcessVersion(this.projectId, processId, version, opts.createdAfter);
    }
}
