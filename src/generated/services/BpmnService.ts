/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnActivityState } from '../models/BpmnActivityState';
import type { BpmnHistoryPage } from '../models/BpmnHistoryPage';
import type { BpmnIncidentRecordPaginatedResponse } from '../models/BpmnIncidentRecordPaginatedResponse';
import type { BpmnInstancePaginatedResponse } from '../models/BpmnInstancePaginatedResponse';
import type { BpmnProcessSummaryPaginatedResponse } from '../models/BpmnProcessSummaryPaginatedResponse';
import type { BpmnProcessVersion } from '../models/BpmnProcessVersion';
import type { BpmnProcessVersionPaginatedResponse } from '../models/BpmnProcessVersionPaginatedResponse';
import type { BpmnResourceDetail } from '../models/BpmnResourceDetail';
import type { BpmnResourcePaginatedResponse } from '../models/BpmnResourcePaginatedResponse';
import type { BpmnResourceSummaryPaginatedResponse } from '../models/BpmnResourceSummaryPaginatedResponse';
import type { BpmnUserTaskPaginatedResponse } from '../models/BpmnUserTaskPaginatedResponse';
import type { BpmnValidateResponse } from '../models/BpmnValidateResponse';
import type { CorrelationKeys } from '../models/CorrelationKeys';
import type { CreateBpmnResourceRequest } from '../models/CreateBpmnResourceRequest';
import type { ExternalJobBatchResponse } from '../models/ExternalJobBatchResponse';
import type { ExternalJobQueueDepthResponse } from '../models/ExternalJobQueueDepthResponse';
import type { MigrateBpmnInstanceRequest } from '../models/MigrateBpmnInstanceRequest';
import type { MigrationValidationResult } from '../models/MigrationValidationResult';
import type { ModifyBpmnInstanceRequest } from '../models/ModifyBpmnInstanceRequest';
import type { StartBpmnTestInstanceRequest } from '../models/StartBpmnTestInstanceRequest';
import type { SuspendBpmnDefinitionRequest } from '../models/SuspendBpmnDefinitionRequest';
import type { SuspendBpmnInstanceRequest } from '../models/SuspendBpmnInstanceRequest';
import type { UpdateUserTaskAssignmentRequest } from '../models/UpdateUserTaskAssignmentRequest';
import type { UserTask } from '../models/UserTask';
import type { ValidateBpmnResourceRequest } from '../models/ValidateBpmnResourceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class BpmnService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List BPMN resources
     * Returns all BPMN resource versions in the project, including drafts and deployed versions.
     * @param projectId
     * @param page
     * @param pageSize
     * @returns BpmnResourcePaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnResources(
        projectId: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<BpmnResourcePaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/resources',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * Create a BPMN resource
     * Uploads a new BPMN XML resource as a draft. Drafts can be edited and
     * tested but cannot start production instances until they are deployed.
     * Invalid XML is rejected. XML identical to the latest deployed resource
     * of the same `<definitions id>` is refused with 409, and nothing is
     * saved.
     *
     * @param projectId
     * @param requestBody
     * @returns BpmnResourceDetail Created
     * @throws ApiError
     */
    public createBpmnResource(
        projectId: string,
        requestBody: CreateBpmnResourceRequest,
    ): CancelablePromise<BpmnResourceDetail> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/resources',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Get a BPMN resource
     * Returns the XML and parsed metadata for a single resource version.
     * @param projectId
     * @param resourceId
     * @returns BpmnResourceDetail OK
     * @throws ApiError
     */
    public getBpmnResource(
        projectId: string,
        resourceId: string,
    ): CancelablePromise<BpmnResourceDetail> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/resources/{resourceID}',
            path: {
                'projectID': projectId,
                'resourceID': resourceId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Update a draft BPMN resource
     * Replaces the XML of an existing draft resource. Once a resource has
     * been deployed it is immutable; deploy a new version instead.
     *
     * @param projectId
     * @param resourceId
     * @param requestBody
     * @returns BpmnResourceDetail OK
     * @throws ApiError
     */
    public updateBpmnResource(
        projectId: string,
        resourceId: string,
        requestBody: CreateBpmnResourceRequest,
    ): CancelablePromise<BpmnResourceDetail> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/projects/{projectID}/bpmn/resources/{resourceID}',
            path: {
                'projectID': projectId,
                'resourceID': resourceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Delete a BPMN resource version
     * Permanently deletes a single resource version. Past instances of this
     * version remain in history. Refused with 409 Conflict while any version
     * of any process inside the resource still has running instances.
     *
     * @param projectId
     * @param resourceId
     * @returns void
     * @throws ApiError
     */
    public deleteBpmnResource(
        projectId: string,
        resourceId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}/bpmn/resources/{resourceID}',
            path: {
                'projectID': projectId,
                'resourceID': resourceId,
            },
            errors: {
                409: `Conflict`,
            },
        });
    }
    /**
     * Deploy a BPMN resource
     * Marks all processes inside the resource as executable, making them
     * available to start instances of. Each of them gets its next version.
     * Deployment is one-way. To change a deployed resource, upload a new
     * version and deploy that. A resource identical to the latest deployed
     * resource of the same `<definitions id>` is refused with 409, and
     * deploying that latest one again changes nothing.
     *
     * @param projectId
     * @param resourceId
     * @returns void
     * @throws ApiError
     */
    public deployBpmnResource(
        projectId: string,
        resourceId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/resources/{resourceID}/deploy',
            path: {
                'projectID': projectId,
                'resourceID': resourceId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Start a test instance from a resource
     * Starts a test instance of a resource, draft or deployed. A draft can
     * only be started this way, which makes it the way to try out an
     * in-progress design before deploying. A suspended definition does not
     * stop it, since the test run takes no deployed version.
     *
     * A test run runs on the same engine as production but stays apart from
     * it, and so do its call-activity children. It stays a test run for
     * life, also after a migration to a deployed version.
     * - Its job task types, message names and signal names carry the
     * `draft:` prefix. A worker activates `draft:<type>` to work its jobs,
     * and a publish names `draft:<name>` to reach it.
     * - Its user tasks, jobs and incidents list only when `instanceID` names
     * it.
     * - Instance counts, analytics and job queue depth leave it out. The
     * instance list shows it, with `draft` set.
     *
     * @param projectId
     * @param resourceId
     * @param requestBody
     * @returns any Created
     * @throws ApiError
     */
    public startBpmnTestInstance(
        projectId: string,
        resourceId: string,
        requestBody: StartBpmnTestInstanceRequest,
    ): CancelablePromise<{
        /**
         * Identifier of the new test instance.
         */
        instanceID?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/resources/{resourceID}/test',
            path: {
                'projectID': projectId,
                'resourceID': resourceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List the latest version of each BPMN resource
     * Returns one entry per unique BPMN definitions id, with the most recent version's metadata.
     * @param projectId
     * @param page
     * @param pageSize
     * @returns BpmnResourceSummaryPaginatedResponse OK
     * @throws ApiError
     */
    public listLatestBpmnResources(
        projectId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<BpmnResourceSummaryPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/resources/latest',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List all versions of a BPMN resource
     * Returns every stored version of a resource identified by the BPMN XML's outer `definitions` id, newest first.
     * @param projectId
     * @param definitionsId
     * @param page
     * @param pageSize
     * @returns BpmnResourcePaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnResourcesByDefinitionsId(
        projectId: string,
        definitionsId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<BpmnResourcePaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/resources/by-definitions-id/{definitionsID}',
            path: {
                'projectID': projectId,
                'definitionsID': definitionsId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Validate BPMN XML without saving
     * Parses BPMN XML and reports any structural errors or warnings.
     * Useful for showing inline validation in design tools without
     * committing the resource. The same checks are run server-side
     * before storing or deploying a resource.
     *
     * @param projectId
     * @param requestBody
     * @returns BpmnValidateResponse OK
     * @throws ApiError
     */
    public validateBpmnXml(
        projectId: string,
        requestBody: ValidateBpmnResourceRequest,
    ): CancelablePromise<BpmnValidateResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/validate',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List child instances of a BPMN instance
     * Returns instances that this instance spawned via CallActivity elements,
     * newest first. Useful for navigating into a multi-level process hierarchy
     * (parents can be discovered via `parentInstanceID` on the child).
     *
     * @param projectId
     * @param instanceId
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most instances per page, 20 by default and 100 at most.
     * @returns BpmnInstancePaginatedResponse OK
     * @throws ApiError
     */
    public getBpmnInstanceChildren(
        projectId: string,
        instanceId: string,
        cursor?: string,
        limit?: number,
    ): CancelablePromise<BpmnInstancePaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/children',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            query: {
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * Get BPMN instance variables
     * Returns the current variables in the root scope of a running or completed instance.
     * @param projectId
     * @param instanceId
     * @returns any OK
     * @throws ApiError
     */
    public getBpmnInstanceVariables(
        projectId: string,
        instanceId: string,
    ): CancelablePromise<{
        variables?: Record<string, any>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/variables',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
        });
    }
    /**
     * Update BPMN instance variables
     * Sets or replaces variables in the root scope of a running instance.
     * The new values become visible to subsequent activities and FEEL
     * expressions immediately. Existing variable keys not present in the
     * payload are kept; pass `null` to clear a key.
     *
     * @param projectId
     * @param instanceId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public updateBpmnInstanceVariables(
        projectId: string,
        instanceId: string,
        requestBody: {
            variables: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/variables',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get a page of a BPMN instance's history
     * A window of an instance's BPMN history, oldest first, for a running or
     * an ended instance. Without a cursor it is the newest entries.
     * `beforeSeq` reads the entries before one, to walk back, and `fromSeq`
     * the entries from one on, to follow a running instance. Every entry
     * carries its `seq`.
     *
     * Page entries leave out `inputs` and `outputs`, so a page costs the same
     * however long the history is. Read one entry's payload from
     * `GetBpmnInstanceHistoryEntry`. The diagram needs no history at all: the
     * instance state's `elementStatistics` and `takenFlows` summarise it.
     *
     * @param projectId
     * @param instanceId
     * @param fromSeq Read the entries from this seq on. Takes precedence over `beforeSeq`.
     * @param beforeSeq Read the newest entries before this seq.
     * @param limit Max entries per page. Clamped server-side to the engine's max page size.
     * @returns BpmnHistoryPage OK
     * @throws ApiError
     */
    public getBpmnInstanceHistory(
        projectId: string,
        instanceId: string,
        fromSeq?: number,
        beforeSeq?: number,
        limit?: number,
    ): CancelablePromise<BpmnHistoryPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/history',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            query: {
                'fromSeq': fromSeq,
                'beforeSeq': beforeSeq,
                'limit': limit,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Get one BPMN history entry with its payload
     * One history entry with its `inputs` and `outputs`. The engine rebuilds
     * them from the variable writes of every entry before it, so the read
     * grows with the entry's position: around 0.3 s at entry 40,000.
     *
     * @param projectId
     * @param instanceId
     * @param seq
     * @returns BpmnActivityState OK
     * @throws ApiError
     */
    public getBpmnInstanceHistoryEntry(
        projectId: string,
        instanceId: string,
        seq: number,
    ): CancelablePromise<BpmnActivityState> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/history/{seq}',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
                'seq': seq,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Resolve an incident and retry the failed activity
     * Marks an incident as resolved and re-runs the activity that produced it.
     * Optional `variables` are merged into the activity's scope before retry -
     * use this to fix the input that caused the failure (e.g. correct a value
     * that triggered a FEEL evaluation error).
     *
     * @param projectId
     * @param instanceId
     * @param incidentId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public resolveBpmnIncident(
        projectId: string,
        instanceId: string,
        incidentId: string,
        requestBody?: {
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/incidents/{incidentID}/resolve',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
                'incidentID': incidentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List BPMN incidents
     * Cross-instance audit listing of incidents in the project. By default
     * returns open incidents first (unresolved), ordered by recency.
     * Filterable by process version, error type, status, and time window.
     *
     * Each row carries the parent process metadata (processID, processName)
     * so a single page render needs no follow-up queries against the
     * instances endpoint. Click-through to a specific instance still uses
     * the instance detail endpoint.
     *
     * @param projectId
     * @param processId Restrict to incidents on instances of one process, in any version unless `version` names one.
     * @param version Restrict to one version of `processID`. Ignored without `processID`.
     * @param instanceId Restrict to incidents on a single instance - useful for an instance-detail "all incidents ever raised here" view that includes resolved rows. A test run's incidents list only by its instance.
     * @param status Filter by lifecycle status. `open` returns unresolved incidents;
     * `resolved` returns only resolved ones. Omit to return both.
     *
     * @param errorType Restrict to a single error category (matches `BpmnIncidentRecord.errorType`).
     * @param since Earliest `raisedAt` to include (inclusive).
     * @param until Latest `raisedAt` to include (exclusive).
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most incidents per page, 20 by default and 100 at most.
     * @returns BpmnIncidentRecordPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnIncidents(
        projectId: string,
        processId?: string,
        version?: number,
        instanceId?: string,
        status?: 'open' | 'resolved',
        errorType?: 'BpmnError' | 'CompensationError' | 'FeelError' | 'GatewayNoMatch' | 'TimerResolution' | 'LinkNotFound' | 'MigrationError' | 'CallActivityCanceled' | 'ExternalRowRefreshError' | 'JobLockLost' | 'DecisionNotFound' | 'DecisionEvaluationError' | 'ProcessNotFound' | 'ProcessSuspended' | 'Unknown',
        since?: string,
        until?: string,
        cursor?: string,
        limit?: number,
    ): CancelablePromise<BpmnIncidentRecordPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/incidents',
            path: {
                'projectID': projectId,
            },
            query: {
                'processID': processId,
                'version': version,
                'instanceID': instanceId,
                'status': status,
                'errorType': errorType,
                'since': since,
                'until': until,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * Migrate a running instance to a newer process version
     * Moves a running instance from its current process version to a newer
     * one. Element mappings tell the engine how to translate active tokens
     * between versions; unmapped element ids must match by id between source
     * and target. Validate the migration plan first via `MigrateValidate`.
     *
     * @param projectId
     * @param instanceId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public migrateBpmnInstance(
        projectId: string,
        instanceId: string,
        requestBody: MigrateBpmnInstanceRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/migrate',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Validate a migration plan without executing it
     * Returns the issues a migration plan would hit if executed: missing
     * mappings, incompatible element types, active boundary events that
     * would be orphaned, etc. Run this before `Migrate` to surface problems
     * to the user.
     *
     * @param projectId
     * @param instanceId
     * @param requestBody
     * @returns MigrationValidationResult OK
     * @throws ApiError
     */
    public validateBpmnInstanceMigration(
        projectId: string,
        instanceId: string,
        requestBody: MigrateBpmnInstanceRequest,
    ): CancelablePromise<MigrationValidationResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/migrate/validate',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Modify a running instance with ad-hoc token operations
     * Operational recovery tool: applies a sequence of token-level
     * instructions (start before a node, cancel a token in a scope) to a
     * running instance. Useful for unblocking instances that have ended up
     * in unintended states. Restricted to project administrators.
     *
     * The instructions are validated against the live instance before
     * anything is applied, and the whole batch is refused with a 400 if any
     * of them cannot be: an unknown scope, a `START_BEFORE_NODE` naming a
     * node the instance's process version does not contain, or a
     * `CANCEL_TOKEN` with no live token, scope or incident at its target.
     * A batch is applied whole or not at all.
     *
     * @param projectId
     * @param instanceId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public modifyBpmnInstance(
        projectId: string,
        instanceId: string,
        requestBody: ModifyBpmnInstanceRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/modify',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Activate an activity inside a running ad-hoc subprocess
     * Manually starts one of the activities inside an active ad-hoc
     * subprocess. Each call activates a fresh execution; the same activity
     * can be triggered repeatedly until the ad-hoc subprocess completes.
     *
     * @param projectId
     * @param instanceId
     * @param adHocNodeId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public triggerBpmnAdHocNode(
        projectId: string,
        instanceId: string,
        adHocNodeId: string,
        requestBody: {
            nodeID: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/adhoc/{adHocNodeID}/trigger',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
                'adHocNodeID': adHocNodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update variables inside a running ad-hoc subprocess
     * Sets variables in the ad-hoc subprocess scope. Active activities and
     * the subprocess's completion condition are re-evaluated against the new
     * values, which may cause the subprocess to complete or branch.
     *
     * @param projectId
     * @param instanceId
     * @param adHocNodeId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public setBpmnAdHocVariables(
        projectId: string,
        instanceId: string,
        adHocNodeId: string,
        requestBody: {
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/adhoc/{adHocNodeID}/variables',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
                'adHocNodeID': adHocNodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Suspend a BPMN instance
     * Pauses forward token dispatch on a single running instance. The
     * instance's lifecycle status stays RUNNING; an orthogonal `suspendedAt`
     * flag layers on top. Idempotent - a second call against an already-
     * suspended instance is a no-op.
     *
     * While suspended, cancel, terminate, resolve-incident and variable
     * update still apply. Anything else that reaches the instance, such as a
     * job completion, a message or a due timer, applies on resume, in the
     * order it arrived.
     *
     * The suspension (operator, reason, timestamp) is also recorded in the
     * instance's history as a `SuspendInstanceEvent`, so the timeline view on
     * the instance detail page can render the cycle.
     *
     * @param projectId
     * @param instanceId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public suspendBpmnInstance(
        projectId: string,
        instanceId: string,
        requestBody?: SuspendBpmnInstanceRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/suspend',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Resume a suspended BPMN instance
     * Clears the instance-scope suspension. If the parent definition is also
     * suspended the instance remains effectively paused until the definition
     * is resumed as well. Idempotent.
     *
     * @param projectId
     * @param instanceId
     * @returns void
     * @throws ApiError
     */
    public resumeBpmnInstance(
        projectId: string,
        instanceId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}/resume',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
        });
    }
    /**
     * Suspend a deployed version of a BPMN process
     * Pauses every running instance of one deployed process version AND
     * rejects new instance starts on that version until it is resumed.
     *
     * Instances that were also explicitly instance-suspended stay paused
     * after a definition-scope resume - the operator must clear that scope
     * too.
     *
     * Idempotent. Suspending again reaches the running instances an earlier
     * call missed. The reason reaches every affected instance's history
     * (`SuspendDefinitionEvent`) so the UI can render where the pause came
     * from.
     *
     * @param projectId
     * @param processId
     * @param version
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public suspendBpmnDefinition(
        projectId: string,
        processId: string,
        version: number,
        requestBody?: SuspendBpmnDefinitionRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/processes/{processID}/versions/{version}/suspend',
            path: {
                'projectID': projectId,
                'processID': processId,
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Process version not found`,
            },
        });
    }
    /**
     * Resume a suspended version of a BPMN process
     * Clears the definition-scope suspension and resumes every running
     * instance of the version. Instances that were also instance-suspended
     * stay paused until their own scope is cleared. New instance starts are
     * accepted again. Idempotent.
     *
     * @param projectId
     * @param processId
     * @param version
     * @returns void
     * @throws ApiError
     */
    public resumeBpmnDefinition(
        projectId: string,
        processId: string,
        version: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/processes/{processID}/versions/{version}/resume',
            path: {
                'projectID': projectId,
                'processID': processId,
                'version': version,
            },
            errors: {
                404: `Process version not found`,
            },
        });
    }
    /**
     * PENDING job counts grouped by taskType
     * Returns one entry per `taskType` with at least one PENDING job. Useful for
     * monitoring queue backlogs and capacity-planning external job workers.
     *
     * @param projectId
     * @param createdAfter Only count jobs created at or after this timestamp. Should match the time-range selector used by the list endpoint so totals stay consistent.
     * @returns ExternalJobQueueDepthResponse OK
     * @throws ApiError
     */
    public getBpmnExternalJobsQueueDepth(
        projectId: string,
        createdAfter?: string,
    ): CancelablePromise<ExternalJobQueueDepthResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/external-jobs/queue-depth',
            path: {
                'projectID': projectId,
            },
            query: {
                'createdAfter': createdAfter,
            },
        });
    }
    /**
     * Fail an external job with a BPMN error code
     * Reports that the worker could not handle the job.
     *
     * The `retryable` flag decides how the failure is treated:
     *
     * * `retryable: true` (the default) - a **technical/transient** failure.
     * If the job has remaining retries it is requeued for another attempt
     * and the retry budget is decremented; the process is NOT notified. Only
     * once retries are exhausted is the `errorCode` raised as a BPMN error,
     * triggering any matching boundary error event on the originating service
     * task (or an incident if none matches).
     * * `retryable: false` - a **business** BPMN error. The `errorCode` is
     * raised on the process immediately, bypassing the retry budget entirely,
     * so a matching boundary error event fires (or an incident is raised)
     * without wasting retries. Use this for domain outcomes a retry could
     * never fix (e.g. `PAYMENT_DECLINED`). SDK workers send this automatically
     * when a handler throws a typed `BpmnError`.
     *
     * Once the instance has ended, any report on its jobs answers 200 and
     * changes nothing.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public throwBpmnExternalJobError(
        projectId: string,
        executionKey: string,
        requestBody: {
            /**
             * Instance ID returned by the poll response.
             */
            instanceID: string;
            errorCode: string;
            /**
             * Optional worker identity (the same `clientID` used to poll).
             * When supplied, a worker that no longer holds the job's lock
             * gets 409 and its report is discarded, so a stale report can't
             * requeue or fail the job. Repeating the report this worker last
             * made on the job answers 200 again and changes nothing. Without
             * it, the report applies to an open job no worker holds a live
             * lock on.
             *
             */
            clientID?: string;
            /**
             * Whether this failure should consume the retry budget before
             * reaching the process. `true` (default) treats it as a
             * technical failure: requeue while retries remain, raise the
             * BPMN error only at exhaustion. `false` treats `errorCode` as a
             * business BPMN error and raises it immediately, bypassing
             * retries so a boundary error event fires (or an incident is
             * raised) at once. SDK workers set `false` for a handler-thrown
             * `BpmnError` and `true` for any other exception.
             *
             */
            retryable?: boolean;
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/{executionKey}/error',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `The instance is running and has no job with this execution key.`,
                409: `The report was discarded. This worker no longer holds the job: its
                lock ran out, another worker holds it, or the job has finished.
                Without a \`clientID\`, a worker holds a live lock on the job, named in
                the message, or the job already ended. The message says when the job
                was cancelled.
                `,
            },
        });
    }
    /**
     * Complete External Jobs in Batch
     * Completes a batch of external jobs in one request. Each item is
     * delivered to its instance in parallel and per-item status is returned
     * so a partial failure does not sink the whole batch.
     *
     * @param projectId
     * @param requestBody
     * @returns ExternalJobBatchResponse Per-item batch result
     * @throws ApiError
     */
    public completeBpmnExternalJobsBatch(
        projectId: string,
        requestBody: {
            /**
             * Optional worker identity (the same `clientID` used to poll)
             * applied to every item in the batch - a batch is one worker's
             * report. When supplied, an item this worker no longer holds
             * comes back with status `error` and its result is discarded,
             * and repeating this worker's last report on an item changes
             * nothing. Without it, an item a worker holds a live lock on, or
             * one that already ended, comes back with status `error`.
             *
             */
            clientID?: string;
            items: Array<{
                executionKey: string;
                instanceID: string;
                variables?: Record<string, any>;
            }>;
        },
    ): CancelablePromise<ExternalJobBatchResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/batch/complete',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Fail external jobs in batch
     * Reports a batch of worker failures in one request. With `retryable: true`
     * (the default) each item's remaining retry budget decides whether it
     * requeues for another attempt or surfaces its `errorCode` as a BPMN
     * error/incident on the originating instance. With `retryable: false` every
     * item is treated as a business BPMN error and raised immediately, bypassing
     * the retry budget (see the single-job error endpoint for the full
     * semantics). Per-item status is returned so a partial failure does not sink
     * the whole batch.
     *
     * @param projectId
     * @param requestBody
     * @returns ExternalJobBatchResponse Per-item batch result
     * @throws ApiError
     */
    public throwBpmnExternalJobErrorsBatch(
        projectId: string,
        requestBody: {
            /**
             * Optional worker identity (the same `clientID` used to poll)
             * applied to every item in the batch - a batch is one worker's
             * report. When supplied, an item this worker no longer holds
             * comes back with status `error` and the job is left untouched,
             * and repeating this worker's last report on an item changes
             * nothing. Without it, an item a worker holds a live lock on, or
             * one that already ended, comes back with status `error`.
             *
             */
            clientID?: string;
            /**
             * Applies to every item in the batch. `true` (default) consumes
             * each item's retry budget before raising its BPMN error; `false`
             * raises every item's `errorCode` as a business BPMN error
             * immediately, bypassing retries. See the single-job error
             * endpoint for the full semantics.
             *
             */
            retryable?: boolean;
            items: Array<{
                executionKey: string;
                instanceID: string;
                errorCode: string;
                variables?: Record<string, any>;
            }>;
        },
    ): CancelablePromise<ExternalJobBatchResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/batch/error',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List User Tasks
     * Paginated list of user tasks for the project, optionally filtered by
     * instance, status, assignee, candidate user, candidate group or due date.
     * Requires Executor role on the project.
     *
     * @param projectId
     * @param instanceId Only this instance's tasks. A test run's tasks list only by its instance.
     * @param status
     * @param assignee
     * @param candidateUser
     * @param candidateGroup
     * @param businessId Exact-match filter on the caller-supplied correlation key.
     * @param dueAfter Only tasks due at or after this time.
     * @param dueBefore Only tasks due before this time. With `status=CREATED` and the current time, the overdue tasks.
     * @param sort `created` lists the newest first, and is the default. `dueDate` lists
     * the soonest due first and tasks without a due date last. `priority`
     * lists the highest priority first. Both list the oldest first among
     * equals. A cursor continues only a list of the same sort.
     *
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most tasks per page, 20 by default and 100 at most.
     * @returns BpmnUserTaskPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnUserTasks(
        projectId: string,
        instanceId?: string,
        status?: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED',
        assignee?: string,
        candidateUser?: string,
        candidateGroup?: string,
        businessId?: string,
        dueAfter?: string,
        dueBefore?: string,
        sort?: 'created' | 'dueDate' | 'priority',
        cursor?: string,
        limit?: number,
    ): CancelablePromise<BpmnUserTaskPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/user-tasks',
            path: {
                'projectID': projectId,
            },
            query: {
                'instanceID': instanceId,
                'status': status,
                'assignee': assignee,
                'candidateUser': candidateUser,
                'candidateGroup': candidateGroup,
                'businessId': businessId,
                'dueAfter': dueAfter,
                'dueBefore': dueBefore,
                'sort': sort,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * List User Tasks for the Caller
     * Returns CREATED user tasks the caller can act on: directly assigned,
     * listed in `candidateUsers`, or whose `candidateGroups` overlap any of
     * the caller's identity-provider groups. Requires Viewer role on the project.
     *
     * @param projectId
     * @param dueAfter Only tasks due at or after this time.
     * @param dueBefore Only tasks due before this time. With the current time, the caller's overdue tasks.
     * @param sort `created` lists the newest first, and is the default. `dueDate` lists
     * the soonest due first and tasks without a due date last. `priority`
     * lists the highest priority first. Both list the oldest first among
     * equals. A cursor continues only a list of the same sort.
     *
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most tasks per page, 20 by default and 100 at most.
     * @returns BpmnUserTaskPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnUserTasksForCaller(
        projectId: string,
        dueAfter?: string,
        dueBefore?: string,
        sort?: 'created' | 'dueDate' | 'priority',
        cursor?: string,
        limit?: number,
    ): CancelablePromise<BpmnUserTaskPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/user-tasks/me',
            path: {
                'projectID': projectId,
            },
            query: {
                'dueAfter': dueAfter,
                'dueBefore': dueBefore,
                'sort': sort,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * Get User Task
     * Fetch a single user task by execution key. Allowed for callers with
     * Executor (or higher) role on the project, OR for callers who are the
     * task's assignee, listed in candidateUsers, or whose identity groups
     * overlap candidateGroups - same access semantics as Complete and Error.
     *
     * @param projectId
     * @param executionKey
     * @returns UserTask OK
     * @throws ApiError
     */
    public getBpmnUserTask(
        projectId: string,
        executionKey: string,
    ): CancelablePromise<UserTask> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/user-tasks/{executionKey}',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            errors: {
                403: `Forbidden - caller is not Executor and not assigned to the task`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update User Task Assignment
     * Reassign / change candidates on a CREATED user task. Only the fields in
     * the body change. Returns 400 for a body with none of them, and 404 if the
     * task does not exist or is no longer in CREATED state. Requires Executor
     * role on the project.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns UserTask OK
     * @throws ApiError
     */
    public updateBpmnUserTaskAssignment(
        projectId: string,
        executionKey: string,
        requestBody: UpdateUserTaskAssignmentRequest,
    ): CancelablePromise<UserTask> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/projects/{projectID}/bpmn/user-tasks/{executionKey}',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Complete User Task
     * Complete a user task with the given variables. Allowed for callers with
     * Executor (or higher) role on the project, OR for callers who are the
     * task's assignee, listed in candidateUsers, or whose identity groups
     * overlap candidateGroups.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public completeBpmnUserTask(
        projectId: string,
        executionKey: string,
        requestBody?: {
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/user-tasks/{executionKey}/complete',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - caller is not Executor and not assigned to the task`,
                404: `User task not found`,
                409: `The task is no longer open: it was already completed or failed,
                possibly by another user a moment earlier, or it was cancelled.
                Nothing was applied.
                `,
            },
        });
    }
    /**
     * Fail a user task with a BPMN error code
     * Reports that the assignee could not complete the task. The `errorCode`
     * is raised from the user-task node so any matching boundary error event
     * can take over the failure path. Same access semantics as Complete.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public throwBpmnUserTaskError(
        projectId: string,
        executionKey: string,
        requestBody: {
            errorCode: string;
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/user-tasks/{executionKey}/error',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - caller is not Executor and not assigned to the task`,
                404: `User task not found`,
                409: `The task is no longer open: it was already completed or failed,
                possibly by another user a moment earlier, or it was cancelled.
                Nothing was applied.
                `,
            },
        });
    }
    /**
     * Publish a BPMN message
     * Publishes a message into the project. Each message is delivered to at
     * most one waiting catch event whose subscription matches `messageName`
     * and whose correlation value equals `correlationKeys`. If no
     * subscriber is currently waiting the message is buffered up to its TTL
     * and delivered to the first matching subscriber that registers.
     *
     * @param projectId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public publishBpmnMessage(
        projectId: string,
        requestBody: {
            /**
             * Name of the message, matched against catch-event subscriptions.
             */
            messageName: string;
            correlationKeys?: CorrelationKeys;
            /**
             * Variables to pass into the receiving instance when the message is delivered.
             */
            variables?: Record<string, any>;
            /**
             * Optional time-to-live for the buffered message. Accepted
             * forms: ISO 8601 duration (`PT1H`, `P1DT12H`), Go duration
             * (`1h30m`), or RFC 3339 absolute timestamp
             * (`2026-12-31T23:59:59Z`). Omitted/empty applies the
             * server's 1-hour default.
             *
             */
            ttl?: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/messages',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `A message start event for \`messageName\` belongs to a suspended
                process definition, so the message would not start it. Nothing was
                published or buffered. Publish again once the definition is resumed.
                `,
            },
        });
    }
    /**
     * Publish a BPMN signal
     * Publishes a signal into the project. Unlike messages, signals are
     * broadcast: every catch event whose subscription matches `signalName`
     * receives the signal. Published signals are buffered for 24 hours, so
     * subscribers that register within that window also receive the signal
     * (after that the buffered copy is purged).
     *
     * @param projectId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public publishBpmnSignal(
        projectId: string,
        requestBody: {
            /**
             * Name of the signal, matched against catch-event subscriptions.
             */
            signalName: string;
            /**
             * Variables to pass into each receiving instance.
             */
            variables?: Record<string, any>;
            /**
             * How long the published signal stays buffered for late
             * subscribers. Accepted forms: ISO 8601 duration (`PT1H`,
             * `P1DT12H`), Go duration (`1h30m`), or RFC 3339 absolute
             * timestamp (`2026-12-31T23:59:59Z`). Omitted/empty applies
             * the server's 24-hour default.
             *
             */
            ttl?: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/signals',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `A signal start event for \`signalName\` belongs to a suspended process
                definition, so the signal would not start it. Nothing was published
                or buffered. Publish again once the definition is resumed.
                `,
            },
        });
    }
    /**
     * List BPMN processes
     * Returns one entry per unique process ID with aggregated counts of
     * running and completed instances across all deployed versions. Use
     * `ListBpmnProcessVersions` to drill into specific versions.
     *
     * @param projectId
     * @param page
     * @param pageSize
     * @param q Optional case-insensitive substring match against process id or process name.
     * @param createdAfter Bounds the totalCount aggregate to instances created at or after this
     * timestamp. Strongly recommended for monitoring views - ended
     * instances stay until retention deletes them, and unfiltered totals
     * scan every kept instance per definition. runningCount ignores this filter (it is always
     * point-in-time).
     *
     * @param suspended Filter by paused versions. `true` → only processes with at least one
     * paused version; `false` → only processes with none. Omit for no
     * filter. This is the cross-process answer to "which definitions are
     * paused?"; `suspendedVersionCount` on each row says how many.
     *
     * @returns BpmnProcessSummaryPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnProcesses(
        projectId: string,
        page: number = 1,
        pageSize: number = 20,
        q?: string,
        createdAfter?: string,
        suspended?: boolean,
    ): CancelablePromise<BpmnProcessSummaryPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/processes',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
                'q': q,
                'createdAfter': createdAfter,
                'suspended': suspended,
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List deployed versions of a BPMN process
     * Returns each deployed version of a single process with its instance
     * counts. Useful for picking the source/target version when migrating
     * running instances.
     *
     * @param projectId
     * @param processId
     * @param page
     * @param pageSize
     * @param createdAfter Bounds the totalCount aggregate to instances created at or after this
     * timestamp. See ListBpmnProcesses for rationale. runningCount ignores
     * this filter.
     *
     * @param suspended Filter by definition-scope suspension. `true` → only paused versions;
     * `false` → only active ones. Omit for no filter.
     *
     * @returns BpmnProcessVersionPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnProcessVersions(
        projectId: string,
        processId: string,
        page: number = 1,
        pageSize: number = 20,
        createdAfter?: string,
        suspended?: boolean,
    ): CancelablePromise<BpmnProcessVersionPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/processes/{processID}/versions',
            path: {
                'projectID': projectId,
                'processID': processId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
                'createdAfter': createdAfter,
                'suspended': suspended,
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get one deployed version of a BPMN process
     * Returns the single deployed version identified by (processID, version)
     * with its instance counts and suspension state, wherever it falls in the
     * pages of `ListBpmnProcessVersions`.
     *
     * @param projectId
     * @param processId
     * @param version
     * @param createdAfter Bounds the totalCount aggregate to instances created at or after this
     * timestamp. See ListBpmnProcesses for rationale. runningCount ignores
     * this filter.
     *
     * @returns BpmnProcessVersion OK
     * @throws ApiError
     */
    public getBpmnProcessVersion(
        projectId: string,
        processId: string,
        version: number,
        createdAfter?: string,
    ): CancelablePromise<BpmnProcessVersion> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/processes/{processID}/versions/{version}',
            path: {
                'projectID': projectId,
                'processID': processId,
                'version': version,
            },
            query: {
                'createdAfter': createdAfter,
            },
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
