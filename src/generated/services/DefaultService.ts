/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchEvaluateDesignRequest } from '../models/BatchEvaluateDesignRequest';
import type { BatchEvaluationResponse } from '../models/BatchEvaluationResponse';
import type { BpmnExternalJobPaginatedResponse } from '../models/BpmnExternalJobPaginatedResponse';
import type { BpmnInstancePaginatedResponse } from '../models/BpmnInstancePaginatedResponse';
import type { BpmnInstanceState } from '../models/BpmnInstanceState';
import type { CreateDefinitionRequest } from '../models/CreateDefinitionRequest';
import type { CreateProjectRequest } from '../models/CreateProjectRequest';
import type { Definition } from '../models/Definition';
import type { EvaluateStoredRequest } from '../models/EvaluateStoredRequest';
import type { EvaluationResult } from '../models/EvaluationResult';
import type { Execution } from '../models/Execution';
import type { ExternalJob } from '../models/ExternalJob';
import type { FeelContext } from '../models/FeelContext';
import type { PaginatedDecisionsResponse } from '../models/PaginatedDecisionsResponse';
import type { PaginatedDefinitionsResponse } from '../models/PaginatedDefinitionsResponse';
import type { PaginatedExecutionsResponse } from '../models/PaginatedExecutionsResponse';
import type { PollBpmnJobRequest } from '../models/PollBpmnJobRequest';
import type { Project } from '../models/Project';
import type { StartBpmnInstanceRequest } from '../models/StartBpmnInstanceRequest';
import type { UpdateDefinitionRequest } from '../models/UpdateDefinitionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DefaultService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Health Check
     * @returns any OK
     * @throws ApiError
     */
    public getHealth(): CancelablePromise<{
        status?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Version
     * @returns any OK
     * @throws ApiError
     */
    public getVersion(): CancelablePromise<{
        version?: string;
        buildTime?: string;
        commit?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/version',
        });
    }
    /**
     * Evaluate ad-hoc DMN XML
     * Evaluates DMN XML supplied in the request without storing it. Useful for
     * testing decisions during authoring or for one-off evaluations that do
     * not need to be tracked. Use the project-scoped evaluation endpoints
     * against deployed definitions instead when running production workloads.
     *
     * @param requestBody
     * @returns EvaluationResult OK
     * @throws ApiError
     */
    public evaluateDesign(
        requestBody: {
            /**
             * DMN XML to evaluate.
             */
            xml: string;
            /**
             * Additional DMN XML documents whose decisions are imported and may be referenced from `xml`.
             */
            additionalXMLs?: Array<string>;
            context?: FeelContext;
            /**
             * Names of decision services to evaluate. If empty, no decision services are evaluated.
             */
            decisionServices?: Array<string>;
            /**
             * Names of decisions or decision services to evaluate. If empty, all decisions in the document are evaluated.
             */
            decisions?: Array<string>;
        },
    ): CancelablePromise<Record<string, EvaluationResult>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/dmn/evaluate/design',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Batch evaluate ad-hoc DMN XML against multiple inputs
     * Evaluates a single DMN document against many input rows in one request.
     * Useful for bulk testing during decision authoring (e.g. running a
     * spreadsheet of expected cases through a draft decision table).
     *
     * @param requestBody
     * @returns BatchEvaluationResponse Batch evaluation successful
     * @throws ApiError
     */
    public evaluateDesignBatch(
        requestBody: BatchEvaluateDesignRequest,
    ): CancelablePromise<BatchEvaluationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/dmn/evaluate/design/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List Projects
     * Lists projects the caller has access to within their account.
     * @returns Project OK
     * @throws ApiError
     */
    public listProjects(): CancelablePromise<Array<Project>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create Project
     * Creates a new project. Projects are workspaces that group DMN definitions
     * and BPMN processes for execution and access control. The caller is
     * automatically added as a project administrator.
     *
     * @param requestBody
     * @returns Project Created
     * @throws ApiError
     */
    public createProject(
        requestBody: CreateProjectRequest,
    ): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                403: `Project quota for the caller's tier has been reached.`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Project
     * Returns the project's metadata.
     * @param projectId Identifier of the project to fetch.
     * @returns Project OK
     * @throws ApiError
     */
    public getProject(
        projectId: string,
    ): CancelablePromise<Project> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}',
            path: {
                'projectID': projectId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete Project
     * Permanently deletes a project and all of its data: DMN definitions and
     * executions, BPMN resources and instances, jobs, user tasks, messages,
     * signals, and members. Running BPMN instances are terminated. This
     * action cannot be undone.
     *
     * @param projectId Identifier of the project to delete.
     * @returns void
     * @throws ApiError
     */
    public deleteProject(
        projectId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}',
            path: {
                'projectID': projectId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List DMN definitions
     * Lists all definition versions in the project. Each call to `CreateDefinition` produces a new version.
     * @param projectId
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedDefinitionsResponse OK
     * @throws ApiError
     */
    public listDefinitions(
        projectId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedDefinitionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create a DMN definition
     * Stores a new DMN definition. Each call creates a new version
     * (auto-incremented). To replace an existing definition, post the new
     * XML with the same `definitionsID`.
     *
     * @param projectId
     * @param requestBody
     * @returns Definition Created
     * @throws ApiError
     */
    public createDefinition(
        projectId: string,
        requestBody: CreateDefinitionRequest,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/dmn/definitions',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List latest DMN definitions
     * Returns the most recent version of each unique definition. Use this for picking a definition to evaluate.
     * @param projectId
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedDefinitionsResponse OK
     * @throws ApiError
     */
    public listLatestDefinitions(
        projectId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedDefinitionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions/latest',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a DMN definition by its DMN definitions id
     * Looks up a definition by the `id` attribute on the `<definitions>` root
     * element of the DMN XML, instead of by the platform-internal `id`.
     * Returns the latest version unless a specific version is requested.
     *
     * @param projectId
     * @param definitionsId Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     * @param version Specific version number (defaults to latest version)
     * @returns Definition OK
     * @throws ApiError
     */
    public getDefinitionByDefinitionsId(
        projectId: string,
        definitionsId: string,
        version?: number,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions/by-definitions-id/{definitionsID}',
            path: {
                'projectID': projectId,
                'definitionsID': definitionsId,
            },
            query: {
                'version': version,
            },
            errors: {
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List all versions of a DMN definition
     * Returns every stored version of a definition identified by its DMN `<definitions id>`, newest to oldest.
     * @param projectId
     * @param definitionsId Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedDefinitionsResponse OK
     * @throws ApiError
     */
    public listDefinitionVersions(
        projectId: string,
        definitionsId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedDefinitionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions/by-definitions-id/{definitionsID}/versions',
            path: {
                'projectID': projectId,
                'definitionsID': definitionsId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Evaluate a DMN definition by its DMN definitions id
     * Evaluates a stored DMN definition addressed by its `<definitions id>`
     * XML attribute. Useful when callers know definitions by their DMN-level
     * identifier rather than the platform's internal `id`. Defaults to the
     * latest deployed version.
     *
     * @param projectId
     * @param definitionsId Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     * @param requestBody
     * @param version Specific version number (defaults to latest version)
     * @returns EvaluationResult OK
     * @throws ApiError
     */
    public evaluateByDefinitionsId(
        projectId: string,
        definitionsId: string,
        requestBody: EvaluateStoredRequest,
        version?: number,
    ): CancelablePromise<Record<string, EvaluationResult>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/dmn/definitions/by-definitions-id/{definitionsID}/evaluate',
            path: {
                'projectID': projectId,
                'definitionsID': definitionsId,
            },
            query: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a DMN definition
     * Returns a single definition version by its platform identifier.
     * @param projectId
     * @param definitionId
     * @returns Definition OK
     * @throws ApiError
     */
    public getDefinition(
        projectId: string,
        definitionId: string,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update a DMN definition's metadata
     * Modifies metadata (name) of a stored definition. The DMN XML and version are immutable; post a new definition with the same XML `id` to publish a new version.
     * @param projectId
     * @param definitionId
     * @param requestBody
     * @returns Definition OK
     * @throws ApiError
     */
    public updateDefinition(
        projectId: string,
        definitionId: string,
        requestBody: UpdateDefinitionRequest,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a DMN definition version
     * Permanently deletes a single definition version. Past executions of this version remain in history.
     * @param projectId
     * @param definitionId
     * @returns void
     * @throws ApiError
     */
    public deleteDefinition(
        projectId: string,
        definitionId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Evaluate a stored DMN definition
     * Evaluates a stored DMN definition against the supplied context.
     * Each call is recorded in execution history and counts toward the
     * account's evaluation quota.
     *
     * @param projectId
     * @param definitionId
     * @param requestBody
     * @returns EvaluationResult OK
     * @throws ApiError
     */
    public evaluateStored(
        projectId: string,
        definitionId: string,
        requestBody: EvaluateStoredRequest,
    ): CancelablePromise<Record<string, EvaluationResult>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}/evaluate',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List executions of a DMN definition
     * Returns paginated execution history for a single definition.
     * @param projectId
     * @param definitionId
     * @param definitionsId Filter by DMN `<definitions id>` (XML id).
     * @param startDate Filter executions after this date (ISO 8601)
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedExecutionsResponse OK
     * @throws ApiError
     */
    public listExecutions(
        projectId: string,
        definitionId: string,
        definitionsId?: string,
        startDate?: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedExecutionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}/executions',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            query: {
                'definitionsID': definitionsId,
                'startDate': startDate,
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List decisions
     * Returns one row per unique decision XML id in the project, with the
     * latest known version and the owning definition. Useful for picking
     * a target decision when wiring a BPMN BusinessRuleTask.
     *
     * @param projectId
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @param q Optional case-insensitive substring match against decision name, decision id, or owning definition name.
     * @returns PaginatedDecisionsResponse OK
     * @throws ApiError
     */
    public listDecisions(
        projectId: string,
        page: number = 1,
        pageSize: number = 20,
        q?: string,
    ): CancelablePromise<PaginatedDecisionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/decisions',
            path: {
                'projectID': projectId,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
                'q': q,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List DMN executions across the project
     * Returns paginated execution history for the entire project, optionally filtered by DMN definition.
     * @param projectId
     * @param definitionsId Filter by DMN `<definitions id>` (XML id).
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedExecutionsResponse OK
     * @throws ApiError
     */
    public listProjectExecutions(
        projectId: string,
        definitionsId?: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedExecutionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/executions',
            path: {
                'projectID': projectId,
            },
            query: {
                'definitionsID': definitionsId,
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a single DMN execution
     * Returns the inputs, outputs, and per-decision evaluation results for a single past execution.
     * @param projectId
     * @param executionId
     * @returns Execution OK
     * @throws ApiError
     */
    public getExecution(
        projectId: string,
        executionId: string,
    ): CancelablePromise<Execution> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/executions/{executionID}',
            path: {
                'projectID': projectId,
                'executionID': executionId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List BPMN instances
     * Returns paginated process instances in the project, optionally filtered by definition or status.
     * @param projectId
     * @param definitionId
     * @param status
     * @param hasIncident Filter by whether the instance has at least one unresolved incident.
     * Omit to return all instances regardless of incident status; pass
     * `true` to show only instances that need operator attention; pass
     * `false` to exclude blocked instances.
     *
     * @param suspended Filter by instance-scope suspension. `true` → only instances with
     * `suspendedAt` set; `false` → only running-and-not-paused. Omit for
     * no filter. Does not consider definition-scope suspension; for a
     * full "is this instance making progress?" view, callers should
     * additionally join against the parent definition.
     *
     * @param createdAfter Only return instances created at or after this timestamp. Strongly
     * recommended for monitoring views — terminal-state instance rows
     * accumulate indefinitely, and unfiltered queries grow linearly with
     * that history.
     *
     * @param page
     * @param pageSize
     * @returns BpmnInstancePaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnInstances(
        projectId: string,
        definitionId?: string,
        status?: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED',
        hasIncident?: boolean,
        suspended?: boolean,
        createdAfter?: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<BpmnInstancePaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances',
            path: {
                'projectID': projectId,
            },
            query: {
                'definitionID': definitionId,
                'status': status,
                'hasIncident': hasIncident,
                'suspended': suspended,
                'createdAfter': createdAfter,
                'page': page,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * Start a BPMN process instance
     * Starts a new instance of a deployed BPMN process. The returned
     * `workflowID` is the stable execution identifier — use it to fetch
     * state, send signals/messages, complete user tasks, etc.
     *
     * @param projectId
     * @param requestBody
     * @returns any Created
     * @throws ApiError
     */
    public startBpmnInstance(
        projectId: string,
        requestBody: StartBpmnInstanceRequest,
    ): CancelablePromise<{
        /**
         * Stable execution identifier of the new instance.
         */
        workflowID?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/instances',
            path: {
                'projectID': projectId,
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
     * Get BPMN instance state
     * Returns the full runtime state of a process instance — current variables,
     * activity history, active scopes, and any unresolved incidents. Use this
     * to render dashboards or to drive operational decisions on a single
     * instance.
     *
     * @param projectId
     * @param workflowId
     * @returns BpmnInstanceState OK
     * @throws ApiError
     */
    public getBpmnInstance(
        projectId: string,
        workflowId: string,
    ): CancelablePromise<BpmnInstanceState> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
            },
        });
    }
    /**
     * Cancel a BPMN instance
     * Cancels a running instance and all of its active activities, jobs, and
     * child instances. Cancellation is best-effort — handlers in flight may
     * still complete before the cancel propagates. Cancelled instances move
     * to status `CANCELED` and stop consuming further work.
     *
     * @param projectId
     * @param workflowId
     * @returns void
     * @throws ApiError
     */
    public cancelBpmnInstance(
        projectId: string,
        workflowId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}/bpmn/instances/{workflowID}',
            path: {
                'projectID': projectId,
                'workflowID': workflowId,
            },
        });
    }
    /**
     * List external jobs
     * Returns paginated external jobs in the project, with optional filters
     * by `taskType`, `status`, and originating instance. Use this to drive
     * a dashboard or to inspect a specific job's history. For pulling
     * pending work as a job worker, use `Poll` instead.
     *
     * @param projectId
     * @param taskType Filter jobs by task type
     * @param status Filter jobs by status
     * @param workflowId Filter jobs by workflow ID
     * @param createdAfter Only return jobs created at or after this timestamp. Strongly
     * recommended for monitoring views — completed-job records accumulate
     * indefinitely, and unfiltered queries grow linearly with that history.
     *
     * @param page
     * @param pageSize
     * @returns BpmnExternalJobPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnExternalJobs(
        projectId: string,
        taskType?: string,
        status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED',
        workflowId?: string,
        createdAfter?: string,
        page?: number,
        pageSize?: number,
    ): CancelablePromise<BpmnExternalJobPaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/external-jobs',
            path: {
                'projectID': projectId,
            },
            query: {
                'taskType': taskType,
                'status': status,
                'workflowID': workflowId,
                'createdAfter': createdAfter,
                'page': page,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * Poll for external jobs (long-poll)
     * Long-polls for PENDING jobs of a given `taskType`. Returns a batch of
     * jobs (up to `maxJobs`) as soon as any are available, or `204 No Content`
     * when the timeout elapses with no work. Each returned job is exclusively
     * leased to the caller for `lockDuration` — call `Heartbeat` to extend
     * the lock, then `Complete` or `ThrowError` to finalize.
     *
     * @param projectId
     * @param requestBody
     * @returns ExternalJob One or more jobs acquired
     * @throws ApiError
     */
    public pollBpmnExternalJobs(
        projectId: string,
        requestBody: PollBpmnJobRequest,
    ): CancelablePromise<Array<ExternalJob>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/poll',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Extend the lock on an acquired job
     * Refreshes the exclusive lock on a job that the caller previously
     * acquired via `Poll`. Call this periodically when handling a job that
     * takes longer than the original `lockDuration`. Other workers cannot
     * claim the job until the lock expires or the job is completed.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns any Lock extended
     * @throws ApiError
     */
    public heartbeatBpmnExternalJob(
        projectId: string,
        executionKey: string,
        requestBody: {
            clientID: string;
            /**
             * Duration string e.g. '30s', '2m'. Defaults to 30s.
             */
            lockDuration?: string;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/{executionKey}/heartbeat',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Job not found, not owned by this client, or already terminated`,
            },
        });
    }
    /**
     * Complete an external job
     * Finalizes an acquired external job successfully. The supplied
     * `variables` are merged into the originating instance's scope and the
     * process resumes after the service task. Idempotent on the executionKey:
     * a second call with the same key after success is a no-op.
     *
     * @param projectId
     * @param executionKey
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public completeBpmnExternalJob(
        projectId: string,
        executionKey: string,
        requestBody: {
            /**
             * Workflow ID returned by the poll response.
             */
            workflowID: string;
            variables?: Record<string, any>;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/bpmn/external-jobs/{executionKey}/complete',
            path: {
                'projectID': projectId,
                'executionKey': executionKey,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
