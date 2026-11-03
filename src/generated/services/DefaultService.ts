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
import type { DecisionVersionList } from '../models/DecisionVersionList';
import type { Definition } from '../models/Definition';
import type { ErrorMode } from '../models/ErrorMode';
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
     * Version
     * @returns any OK
     * @throws ApiError
     */
    public getVersion(): CancelablePromise<{
        version?: string;
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
            errorMode?: ErrorMode;
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
     * Lists the projects the caller's token grants access to. Projects come
     * from the deployment's provisioning file.
     *
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
     * List DMN definitions
     * Lists every saved definition in the project, drafts and deployed, newest first.
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
     * Saves a new draft. A draft is not evaluable until `DeployDefinition`
     * deploys it. To change a deployed definition, save its new XML as
     * another draft of the same `definitionsID` and deploy that. XML
     * identical to the latest deployed version of its `definitionsID` is
     * refused with 409, and nothing is saved.
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
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List latest DMN definitions
     * Returns the newest saved definition of each `definitionsID`, draft or deployed.
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
     * Looks up a deployed definition by the `id` attribute on the
     * `<definitions>` root element of the DMN XML, instead of by the
     * platform-internal `id`. Returns the latest deployed version unless
     * `version` names one. A draft is not found this way.
     *
     * @param projectId
     * @param definitionsId Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     * @param version Deployed version, the latest when omitted.
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
     * Returns every saved definition of a DMN `<definitions id>`, drafts and deployed, newest first. A deployed one carries the version its deploy gave it.
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
     * Evaluates a deployed DMN definition addressed by its `<definitions id>`
     * XML attribute, the latest deployed version unless `version` names one,
     * and records the evaluation. A definition with no deployed version
     * answers 404. Drafts evaluate through `EvaluateDesign`.
     *
     * @param projectId
     * @param definitionsId Stable identifier from the DMN XML's outer `<definitions id="…">` attribute.
     * @param requestBody
     * @param version Deployed version, the latest when omitted.
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
     * Update a DMN definition version
     * Replaces the name and XML of a draft. A deployed definition is read-only and answers 409, so save the change as a new draft instead.
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
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete a DMN definition version
     * Permanently deletes a draft. A deployed definition answers 409, since the engine keeps its version and evaluations.
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
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Deploy a DMN definition
     * Deploys a draft, which makes its decisions evaluable and callable from
     * business rule tasks. Its document gets the next version of its
     * `definitionsID`, and each decision the next version of its decision id.
     * A draft identical to the latest deployed version is refused with 409. A
     * deployed definition is read-only, and deploying it again answers 409.
     *
     * @param projectId
     * @param definitionId
     * @returns Definition OK
     * @throws ApiError
     */
    public deployDefinition(
        projectId: string,
        definitionId: string,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/dmn/definitions/{definitionID}/deploy',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List decisions
     * Returns one row per deployed decision in the project, at its latest
     * version and with the definition that version came from. Useful for
     * picking a target decision when wiring a BPMN BusinessRuleTask.
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
     * List a decision's deployed versions
     * Returns every deployed version of a decision, the latest first, with
     * the DMN definition version it came from. Decision versions count per
     * decision id, and a BPMN BusinessRuleTask that binds a version names one
     * of them.
     *
     * @param projectId
     * @param decisionId ID of the decision node from the DMN XML.
     * @returns DecisionVersionList OK
     * @throws ApiError
     */
    public listDecisionVersions(
        projectId: string,
        decisionId: string,
    ): CancelablePromise<DecisionVersionList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/dmn/decisions/{decisionID}/versions',
            path: {
                'projectID': projectId,
                'decisionID': decisionId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List DMN executions across the project
     * Returns the project's recorded decision evaluations, newest first:
     * those of `EvaluateByDefinitionsID` and of business rule tasks. A test
     * run's evaluations are left out.
     *
     * @param projectId
     * @param definitionsId Filter by DMN `<definitions id>` (XML id).
     * @param version Only evaluations of this deployed version of `definitionsID`. Ignored without `definitionsID`.
     * @param businessId Exact-match filter on the caller-supplied correlation key.
     * @param startDate Only return executions at or after this instant (ISO 8601). Bounds the scan and the reported total; omit for the full unbounded history.
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedExecutionsResponse OK
     * @throws ApiError
     */
    public listProjectExecutions(
        projectId: string,
        definitionsId?: string,
        version?: number,
        businessId?: string,
        startDate?: string,
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
                'version': version,
                'businessId': businessId,
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
     * Get a single DMN execution
     * Returns the inputs and per-decision results of a single recorded evaluation.
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
     * Returns paginated process instances in the project, optionally filtered by process, version or status.
     * @param projectId
     * @param status
     * @param hasIncident Filter by whether the instance has at least one unresolved incident.
     * Omit to return all instances regardless of incident status; pass
     * `true` to show only instances that need operator attention; pass
     * `false` to exclude blocked instances.
     *
     * @param suspended Filter by effective suspension - either scope counts. `true` → only
     * instances paused at instance scope (`suspendedAt` set) or whose
     * definition is paused (`definitionSuspended`); `false` → only
     * instances paused at neither scope. Omit for no filter. Read those
     * two row fields to tell the scopes apart; resume acts on one scope
     * at a time.
     *
     * @param createdAfter Only return instances created at or after this timestamp. Strongly
     * recommended for monitoring views - ended instances stay until
     * retention deletes them, and unfiltered queries grow linearly with
     * that history.
     *
     * @param businessId Prefix match on the caller-supplied correlation key set at start time.
     * @param processId Only instances of this process id, in any version unless `version` names one.
     * @param version Only instances of this version of `processId`. Ignored without `processId`.
     * @param draft `true` keeps only test runs (see `StartBpmnTestInstance`), `false`
     * leaves them out. Omit for both.
     *
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most instances per page, 20 by default and 100 at most.
     * @returns BpmnInstancePaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnInstances(
        projectId: string,
        status?: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'TERMINATED',
        hasIncident?: boolean,
        suspended?: boolean,
        createdAfter?: string,
        businessId?: string,
        processId?: string,
        version?: number,
        draft?: boolean,
        cursor?: string,
        limit?: number,
    ): CancelablePromise<BpmnInstancePaginatedResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances',
            path: {
                'projectID': projectId,
            },
            query: {
                'status': status,
                'hasIncident': hasIncident,
                'suspended': suspended,
                'createdAfter': createdAfter,
                'businessId': businessId,
                'processId': processId,
                'version': version,
                'draft': draft,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * Start a BPMN process instance
     * Starts a new instance of a deployed BPMN process, the latest version
     * unless the request names one. The returned `instanceID` addresses the
     * instance - use it to fetch state, send signals/messages, complete user
     * tasks, etc.
     *
     * A process with no deployed version, or without the requested one,
     * answers 404, also when it exists in a resource that is not deployed yet.
     * Drafts only start test instances, see `StartBpmnTestInstance`.
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
         * Identifier of the new instance.
         */
        instanceID?: string;
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
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get BPMN instance state
     * Returns the runtime state of a process instance - current variables,
     * active scopes, and any unresolved incidents. Its history is paged
     * separately, see `GetBpmnInstanceHistory`.
     *
     * @param projectId
     * @param instanceId
     * @returns BpmnInstanceState OK
     * @throws ApiError
     */
    public getBpmnInstance(
        projectId: string,
        instanceId: string,
    ): CancelablePromise<BpmnInstanceState> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Cancel a BPMN instance
     * Cancels a running instance and all of its active activities, jobs, and
     * child instances. Cancellation is best-effort - handlers in flight may
     * still complete before the cancel propagates. Cancelled instances move
     * to status `CANCELED` and stop consuming further work.
     * The cancel is recorded in the instance's history as a
     * `CancelInstanceEvent` naming who cancelled it.
     *
     * @param projectId
     * @param instanceId
     * @returns void
     * @throws ApiError
     */
    public cancelBpmnInstance(
        projectId: string,
        instanceId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}/bpmn/instances/{instanceID}',
            path: {
                'projectID': projectId,
                'instanceID': instanceId,
            },
            errors: {
                400: `The instance is a call-activity child of a running instance. Cancel the root instance instead.`,
                404: `No instance has this ID.`,
            },
        });
    }
    /**
     * List external jobs
     * Returns paginated external jobs in the project, with optional filters
     * by `taskType`, `status`, and originating instance. The list holds the
     * pending jobs and the finished jobs of running instances. An instance's
     * jobs leave the list when it ends, and its history keeps each job's task
     * type, retries left and worker. For pulling pending work as a job
     * worker, use `Poll` instead.
     *
     * @param projectId
     * @param taskType Filter jobs by task type
     * @param status Filter jobs by status
     * @param instanceId Only this instance's jobs. A test run's jobs list only by its instance.
     * @param businessId Prefix match on the caller-supplied correlation key.
     * @param createdAfter Only return jobs created at or after this timestamp.
     * @param cursor The `nextCursor` of the page before, absent for the first page.
     * @param limit Most jobs per page, 20 by default and 100 at most.
     * @returns BpmnExternalJobPaginatedResponse OK
     * @throws ApiError
     */
    public listBpmnExternalJobs(
        projectId: string,
        taskType?: string,
        status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELED',
        instanceId?: string,
        businessId?: string,
        createdAfter?: string,
        cursor?: string,
        limit?: number,
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
                'instanceID': instanceId,
                'businessId': businessId,
                'createdAfter': createdAfter,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * Poll for external jobs (long-poll)
     * Long-polls for PENDING jobs of a given `taskType`. Returns a batch of
     * jobs (up to `maxJobs`) as soon as any are available, or `204 No Content`
     * when the timeout elapses with no work. Each returned job is locked to
     * the caller until `lockDuration` passes without a `Heartbeat`, and for at
     * most the server's `ENGINE_JOB_MAX_HOLD` (30m by default) in total. Finish
     * with `Complete` or `ThrowError`. A lock that runs out costs the job a
     * retry, and with no retries left it raises an incident.
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
            errors: {
                400: `An empty \`clientID\`, or a \`lockDuration\` or \`timeout\` that is not a Go duration.`,
            },
        });
    }
    /**
     * Extend the lock on an acquired job
     * Keeps the caller's lock on a job it acquired via `Poll` for another
     * `lockDuration`, up to `ENGINE_JOB_MAX_HOLD` after the job was handed out.
     * SDK workers send it at half of the lock the poll granted
     * (`lockExpiresAt`) while a handler runs.
     * Other workers cannot claim the job while the lock holds.
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
                400: `An empty \`clientID\`, or a \`lockDuration\` that is not a Go duration.`,
                404: `No job has this execution key, or its instance has ended. Stop working on it.`,
                409: `This worker no longer holds the job. Its lock ran out, another
                worker holds it, or the job has finished. Stop working on it. The
                message says when the job was cancelled.
                `,
            },
        });
    }
    /**
     * Complete an external job
     * Finalizes an acquired external job successfully. The supplied
     * `variables` are merged into the originating instance's scope and the
     * process resumes after the service task. Idempotent on the executionKey:
     * a second call with the same key after success is a no-op. Once the
     * instance has ended, any report on its jobs answers 200 and changes
     * nothing.
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
             * Instance ID returned by the poll response.
             */
            instanceID: string;
            /**
             * Optional worker identity (the same `clientID` used to poll).
             * When supplied, a worker that no longer holds the job's lock
             * gets 409 and its result is discarded. Repeating the report
             * this worker last made on the job answers 200 again and changes
             * nothing. Without it, the completion applies to an open job no
             * worker holds a live lock on, as a completion from the console
             * does.
             *
             */
            clientID?: string;
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
            errors: {
                404: `The instance is running and has no job with this execution key.`,
                409: `The result was discarded. This worker no longer holds the job: its
                lock ran out, another worker holds or completed it, or the job
                failed or was cancelled. Without a \`clientID\`, a worker holds a live
                lock on the job, named in the message, or the job already ended. The
                message says when it was cancelled.
                `,
            },
        });
    }
}
