/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BpmnInstanceChildrenResponse } from '../models/BpmnInstanceChildrenResponse';
import type { BpmnProcessSummaryPaginatedResponse } from '../models/BpmnProcessSummaryPaginatedResponse';
import type { BpmnProcessVersionPaginatedResponse } from '../models/BpmnProcessVersionPaginatedResponse';
import type { BpmnResourceDetail } from '../models/BpmnResourceDetail';
import type { BpmnResourcePaginatedResponse } from '../models/BpmnResourcePaginatedResponse';
import type { BpmnResourceSummaryPaginatedResponse } from '../models/BpmnResourceSummaryPaginatedResponse';
import type { BpmnUserTaskPaginatedResponse } from '../models/BpmnUserTaskPaginatedResponse';
import type { BpmnValidateResponse } from '../models/BpmnValidateResponse';
import type { CorrelationKeys } from '../models/CorrelationKeys';
import type { CreateBpmnResourceRequest } from '../models/CreateBpmnResourceRequest';
import type { ExternalJobActiveWorkersResponse } from '../models/ExternalJobActiveWorkersResponse';
import type { ExternalJobBatchResponse } from '../models/ExternalJobBatchResponse';
import type { ExternalJobQueueDepthResponse } from '../models/ExternalJobQueueDepthResponse';
import type { MigrateBpmnInstanceRequest } from '../models/MigrateBpmnInstanceRequest';
import type { MigrationValidationResult } from '../models/MigrationValidationResult';
import type { ModifyBpmnInstanceRequest } from '../models/ModifyBpmnInstanceRequest';
import type { StartBpmnTestInstanceRequest } from '../models/StartBpmnTestInstanceRequest';
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
     * The XML is validated; invalid XML is rejected.
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
                409: `Conflict — resource is already deployed`,
            },
        });
    }
    /**
     * Delete a BPMN resource version
     * Permanently deletes a single resource version. Past instances of this version remain in history.
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
        });
    }
    /**
     * Deploy a BPMN resource
     * Marks all processes inside the resource as executable, making them
     * available to start instances of. Deployment is one-way; to change a
     * deployed resource, upload a new version and deploy that.
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
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Start a test instance from a draft resource
     * Starts a process instance against a draft (non-deployed) resource.
     * Useful for trying out an in-progress design before deploying.
     * Test instances run with the same engine as production but are flagged
     * so they can be filtered out of dashboards.
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
         * Stable execution identifier of the new test instance.
         */
        workflowID?: string;
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
     * Returns every stored version of a resource identified by the BPMN XML's outer `definitions` id, oldest to newest.
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
     * Returns instances that this instance spawned via CallActivity elements.
     * Useful for navigating into a multi-level process hierarchy (parents
     * can be discovered via `parentWorkflowID` on the child).
     *
     * @param projectId
     * @param workflowId
     * @returns BpmnInstanceChildrenResponse OK
     * @throws ApiError
     */
    public getBpmnInstanceChildren(
        projectId: string,
        workflowId: string,
    ): CancelablePromise<BpmnInstanceChildrenResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/children',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
            },
        });
    }
    /**
     * Get BPMN instance variables
     * Returns the current variables in the root scope of a running or completed instance.
     * @param projectId
     * @param workflowId
     * @returns any OK
     * @throws ApiError
     */
    public getBpmnInstanceVariables(
        projectId: string,
        workflowId: string,
    ): CancelablePromise<{
        variables?: Record<string, any>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/variables',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
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
     * @param workflowId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public updateBpmnInstanceVariables(
        projectId: string,
        workflowId: string,
        requestBody: {
            variables: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/variables',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Resolve an incident and retry the failed activity
     * Marks an incident as resolved and re-runs the activity that produced it.
     * Optional `variables` are merged into the activity's scope before retry —
     * use this to fix the input that caused the failure (e.g. correct a value
     * that triggered a FEEL evaluation error).
     *
     * @param projectId
     * @param workflowId
     * @param incidentId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public resolveBpmnIncident(
        projectId: string,
        workflowId: string,
        incidentId: string,
        requestBody?: {
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/incidents/{incidentID}/resolve',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
                'incidentID': incidentId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * @param workflowId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public migrateBpmnInstance(
        projectId: string,
        workflowId: string,
        requestBody: MigrateBpmnInstanceRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/migrate',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
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
     * @param workflowId
     * @param requestBody
     * @returns MigrationValidationResult OK
     * @throws ApiError
     */
    public validateBpmnInstanceMigration(
        projectId: string,
        workflowId: string,
        requestBody: MigrateBpmnInstanceRequest,
    ): CancelablePromise<MigrationValidationResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/migrate/validate',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
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
     * @param projectId
     * @param workflowId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public modifyBpmnInstance(
        projectId: string,
        workflowId: string,
        requestBody: ModifyBpmnInstanceRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/modify',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Activate an activity inside a running ad-hoc subprocess
     * Manually starts one of the activities inside an active ad-hoc
     * subprocess. Each call activates a fresh execution; the same activity
     * can be triggered repeatedly until the ad-hoc subprocess completes.
     *
     * @param projectId
     * @param workflowId
     * @param adHocNodeId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public triggerBpmnAdHocNode(
        projectId: string,
        workflowId: string,
        adHocNodeId: string,
        requestBody: {
            nodeID: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/adhoc/{adHocNodeID}/trigger',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
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
     * @param workflowId
     * @param adHocNodeId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public setBpmnAdHocVariables(
        projectId: string,
        workflowId: string,
        adHocNodeId: string,
        requestBody: {
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}/adhoc/{adHocNodeID}/variables',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
                'adHocNodeID': adHocNodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * Live count of long-poll workers grouped by taskType
     * Returns the count of workers currently long-polling for each `taskType`.
     * Reflects only currently-connected workers; long-polls that have timed out
     * or disconnected are not counted.
     *
     * @param projectId
     * @returns ExternalJobActiveWorkersResponse OK
     * @throws ApiError
     */
    public getBpmnExternalJobsActiveWorkers(
        projectId: string,
    ): CancelablePromise<ExternalJobActiveWorkersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/external-jobs/workers',
            path: {
                'projectID': projectId,
            },
        });
    }
    /**
     * Fail an external job with a BPMN error code
     * Reports that the worker could not handle the job. The `errorCode` is
     * raised as a BPMN error, triggering any matching boundary error event
     * on the originating service task. If the job has remaining retries it
     * is requeued; otherwise the originating instance gets an incident.
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
            errorCode: string;
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
            items: Array<{
                executionKey: string;
                workflowID: string;
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
     * Reports a batch of worker failures in one request. Each item's
     * remaining retry budget determines whether it requeues for another
     * attempt or surfaces as an incident on the originating instance.
     * Per-item status is returned so a partial failure does not sink the
     * whole batch.
     *
     * @param projectId
     * @param requestBody
     * @returns ExternalJobBatchResponse Per-item batch result
     * @throws ApiError
     */
    public throwBpmnExternalJobErrorsBatch(
        projectId: string,
        requestBody: {
            items: Array<{
                executionKey: string;
                workflowID: string;
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
     * workflow, status, assignee, candidate user or candidate group.
     * Requires Executor role on the project.
     *
     * @param projectId
     * @param workflowId
     * @param status
     * @param assignee
     * @param candidateUser
     * @param candidateGroup
     * @param page
     * @param pageSize
     * @returns BpmnUserTaskPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnUserTasks(
        projectId: string,
        workflowId?: string,
        status?: 'CREATED' | 'COMPLETED' | 'CANCELED' | 'FAILED',
        assignee?: string,
        candidateUser?: string,
        candidateGroup?: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<BpmnUserTaskPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/user-tasks',
            path: {
                'projectID': projectId,
            },
            query: {
                'workflowID': workflowId,
                'status': status,
                'assignee': assignee,
                'candidateUser': candidateUser,
                'candidateGroup': candidateGroup,
                'page': page,
                'pageSize': pageSize,
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
     * @param page
     * @param pageSize
     * @returns BpmnUserTaskPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnUserTasksForCaller(
        projectId: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<BpmnUserTaskPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/user-tasks/me',
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
     * Get User Task
     * Fetch a single user task by execution key. Allowed for callers with
     * Executor (or higher) role on the project, OR for callers who are the
     * task's assignee, listed in candidateUsers, or whose identity groups
     * overlap candidateGroups — same access semantics as Complete and Error.
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
                403: `Forbidden — caller is not Executor and not assigned to the task`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update User Task Assignment
     * Reassign / change candidates on a CREATED user task. Returns 404 if the
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
                403: `Forbidden — caller is not Executor and not assigned to the task`,
                404: `User task not found`,
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
                403: `Forbidden — caller is not Executor and not assigned to the task`,
                404: `User task not found`,
            },
        });
    }
    /**
     * Publish a BPMN message
     * Publishes a message into the project. Each message is delivered to at
     * most one waiting catch event whose subscription matches `messageName`
     * and whose correlation keys are a subset of `correlationKeys`. If no
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
     * timestamp. Strongly recommended for monitoring views — instance
     * history accumulates indefinitely and unfiltered totals scan the full
     * table per definition. runningCount ignores this filter (it is always
     * point-in-time).
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
     * @returns BpmnProcessVersionPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnProcessVersions(
        projectId: string,
        processId: string,
        page: number = 1,
        pageSize: number = 20,
        createdAfter?: string,
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
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
}
