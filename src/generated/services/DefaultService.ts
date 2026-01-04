/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddProjectMemberRequest } from '../models/AddProjectMemberRequest';
import type { BatchEvaluateDesignRequest } from '../models/BatchEvaluateDesignRequest';
import type { BatchEvaluationResponse } from '../models/BatchEvaluationResponse';
import type { CreateDefinitionRequest } from '../models/CreateDefinitionRequest';
import type { CreateProjectRequest } from '../models/CreateProjectRequest';
import type { Definition } from '../models/Definition';
import type { EvaluateStoredRequest } from '../models/EvaluateStoredRequest';
import type { EvaluationResult } from '../models/EvaluationResult';
import type { Execution } from '../models/Execution';
import type { FeelContext } from '../models/FeelContext';
import type { FrontendConfig } from '../models/FrontendConfig';
import type { OrganizationUser } from '../models/OrganizationUser';
import type { OverviewResponse } from '../models/OverviewResponse';
import type { PaginatedDefinitionsResponse } from '../models/PaginatedDefinitionsResponse';
import type { PaginatedExecutionsResponse } from '../models/PaginatedExecutionsResponse';
import type { Project } from '../models/Project';
import type { ProjectMember } from '../models/ProjectMember';
import type { Quota } from '../models/Quota';
import type { SimulationRequest } from '../models/SimulationRequest';
import type { SimulationResponse } from '../models/SimulationResponse';
import type { Tier } from '../models/Tier';
import type { UpdateDefinitionRequest } from '../models/UpdateDefinitionRequest';
import type { UpdateProjectMemberRoleRequest } from '../models/UpdateProjectMemberRoleRequest';
import type { UserPermissions } from '../models/UserPermissions';
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
     * Get Overview Dashboard Data
     * Returns aggregated statistics for the overview dashboard including KPI charts and quota status.
     * @returns OverviewResponse OK
     * @throws ApiError
     */
    public getOverview(): CancelablePromise<OverviewResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/overview',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Version
     * @returns any OK
     * @throws ApiError
     */
    public getVersion(): CancelablePromise<{
        version?: string;
        build_time?: string;
        commit?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/version',
        });
    }
    /**
     * Get Frontend Configuration
     * Returns configuration required by the frontend application (OIDC settings)
     * @returns FrontendConfig OK
     * @throws ApiError
     */
    public getFrontendConfig(): CancelablePromise<FrontendConfig> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/config',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update Customer Settings
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public updateCustomerSettings(
        requestBody: {
            allowOverage?: boolean;
        },
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List Organization Users
     * @param search Search by email or username
     * @returns OrganizationUser OK
     * @throws ApiError
     */
    public listUsers(
        search?: string,
    ): CancelablePromise<Array<OrganizationUser>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users',
            query: {
                'search': search,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Batch Get Organization Users
     * Retrieve multiple users by their IDs. Available to all authenticated organization members.
     * @param requestBody
     * @returns OrganizationUser OK
     * @throws ApiError
     */
    public batchGetUsers(
        requestBody: {
            user_ids: Array<string>;
        },
    ): CancelablePromise<Array<OrganizationUser>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Customer Portal Session
     * Returns a generated link to the Paddle Customer Portal
     * @returns any OK
     * @throws ApiError
     */
    public getCustomerPortalSession(): CancelablePromise<{
        url?: string;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/subscription/portal-session',
            errors: {
                403: `Forbidden (No subscription)`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create Subscription Upgrade Transaction
     * Creates a Paddle transaction to upgrade/downgrade the current subscription
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public createSubscriptionUpgradeTransaction(
        requestBody: {
            priceId: string;
        },
    ): CancelablePromise<{
        transactionId?: string;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/billing/upgrade-transaction',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                404: `No active subscription`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get User Permissions
     * Returns the current user's global role and all project-level permissions
     * @returns UserPermissions OK
     * @throws ApiError
     */
    public getUserPermissions(): CancelablePromise<UserPermissions> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/permissions',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Evaluate DMN Design
     * @param requestBody
     * @returns EvaluationResult OK
     * @throws ApiError
     */
    public evaluateDesign(
        requestBody: {
            xml: string;
            context?: FeelContext;
            /**
             * Names of the Decision Services to evaluate (optional)
             */
            decisionServices?: Array<string>;
            /**
             * List of Decision or Decision Service names to evaluate (optional)
             */
            decisions?: Array<string>;
        },
    ): CancelablePromise<Record<string, EvaluationResult>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/evaluate/design',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Evaluate Stored Definition
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
            url: '/projects/{projectID}/definitions/{definitionID}/evaluate',
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
     * Batch evaluate a DMN design with multiple inputs
     * @param requestBody
     * @returns BatchEvaluationResponse Batch evaluation successful
     * @throws ApiError
     */
    public evaluateDesignBatch(
        requestBody: BatchEvaluateDesignRequest,
    ): CancelablePromise<BatchEvaluationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/evaluate/design/batch',
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
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Project
     * @param projectId
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
     * @param projectId
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
     * List Project Members
     * @param projectId
     * @returns ProjectMember OK
     * @throws ApiError
     */
    public listProjectMembers(
        projectId: string,
    ): CancelablePromise<Array<ProjectMember>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/members',
            path: {
                'projectID': projectId,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Add Project Member
     * @param projectId
     * @param requestBody
     * @returns ProjectMember Created
     * @throws ApiError
     */
    public addProjectMember(
        projectId: string,
        requestBody: AddProjectMemberRequest,
    ): CancelablePromise<ProjectMember> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/members',
            path: {
                'projectID': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update Project Member Role
     * @param projectId
     * @param userId
     * @param requestBody
     * @returns ProjectMember OK
     * @throws ApiError
     */
    public updateProjectMemberRole(
        projectId: string,
        userId: string,
        requestBody: UpdateProjectMemberRoleRequest,
    ): CancelablePromise<ProjectMember> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/projects/{projectID}/members/{userID}',
            path: {
                'projectID': projectId,
                'userID': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Remove Project Member
     * @param projectId
     * @param userId
     * @returns void
     * @throws ApiError
     */
    public removeProjectMember(
        projectId: string,
        userId: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/projects/{projectID}/members/{userID}',
            path: {
                'projectID': projectId,
                'userID': userId,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List Definitions
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
            url: '/projects/{projectID}/definitions',
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
     * Create Definition
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
            url: '/projects/{projectID}/definitions',
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
     * List Latest Definitions (one per definition_id)
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
            url: '/projects/{projectID}/definitions/latest',
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
     * Get definition by XML definition ID
     * Get the latest version of a definition by its XML definition ID, or a specific version if provided
     * @param projectId
     * @param xmlDefinitionId The XML definition ID from the DMN model
     * @param version Specific version number (defaults to latest version)
     * @returns Definition OK
     * @throws ApiError
     */
    public getDefinitionByXmlid(
        projectId: string,
        xmlDefinitionId: string,
        version?: number,
    ): CancelablePromise<Definition> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/definitions/by-xml-id/{xmlDefinitionID}',
            path: {
                'projectID': projectId,
                'xmlDefinitionID': xmlDefinitionId,
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
     * Evaluate definition by XML definition ID
     * Evaluate a decision using XML definition ID (uses latest version unless version parameter specified)
     * @param projectId
     * @param xmlDefinitionId The XML definition ID from the DMN model
     * @param requestBody
     * @param version Specific version number (defaults to latest version)
     * @returns EvaluationResult OK
     * @throws ApiError
     */
    public evaluateByXmlid(
        projectId: string,
        xmlDefinitionId: string,
        requestBody: EvaluateStoredRequest,
        version?: number,
    ): CancelablePromise<Record<string, EvaluationResult>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/definitions/by-xml-id/{xmlDefinitionID}/evaluate',
            path: {
                'projectID': projectId,
                'xmlDefinitionID': xmlDefinitionId,
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
     * List all versions of a specific definition_id
     * @param projectId
     * @param definitionId
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedDefinitionsResponse OK
     * @throws ApiError
     */
    public listDefinitionVersions(
        projectId: string,
        definitionId: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedDefinitionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/definitions/by-definition-id/{definitionId}',
            path: {
                'projectID': projectId,
                'definitionId': definitionId,
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
     * Get Definition
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
            url: '/projects/{projectID}/definitions/{definitionID}',
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
     * Update Definition
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
            url: '/projects/{projectID}/definitions/{definitionID}',
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
     * Delete Definition
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
            url: '/projects/{projectID}/definitions/{definitionID}',
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
     * Run Simulation on Historical Data
     * @param projectId
     * @param definitionId
     * @param requestBody
     * @returns SimulationResponse Simulation successful
     * @throws ApiError
     */
    public runSimulation(
        projectId: string,
        definitionId: string,
        requestBody: SimulationRequest,
    ): CancelablePromise<SimulationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/projects/{projectID}/definitions/{definitionID}/simulate',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List Executions for Definition
     * @param projectId
     * @param definitionId
     * @param xmlDefinitionId Filter by XML Definition ID
     * @param startDate Filter executions after this date (ISO 8601)
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedExecutionsResponse OK
     * @throws ApiError
     */
    public listExecutions(
        projectId: string,
        definitionId: string,
        xmlDefinitionId?: string,
        startDate?: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedExecutionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/definitions/{definitionID}/executions',
            path: {
                'projectID': projectId,
                'definitionID': definitionId,
            },
            query: {
                'xmlDefinitionId': xmlDefinitionId,
                'start_date': startDate,
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
     * List All Executions for Project
     * @param projectId
     * @param xmlDefinitionId Filter by XML Definition ID
     * @param page Page number (1-indexed)
     * @param pageSize Number of items per page (max 100)
     * @returns PaginatedExecutionsResponse OK
     * @throws ApiError
     */
    public listProjectExecutions(
        projectId: string,
        xmlDefinitionId?: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<PaginatedExecutionsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/projects/{projectID}/executions',
            path: {
                'projectID': projectId,
            },
            query: {
                'xmlDefinitionId': xmlDefinitionId,
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
     * Get Execution
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
            url: '/projects/{projectID}/executions/{executionID}',
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
     * Get Quota Limits
     * @returns Quota OK
     * @throws ApiError
     */
    public getLimits(): CancelablePromise<Quota> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/limits',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * List Tiers
     * @returns Tier OK
     * @throws ApiError
     */
    public listTiers(): CancelablePromise<Array<Tier>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tiers',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Tier
     * @param tierId
     * @returns Tier OK
     * @throws ApiError
     */
    public getTier(
        tierId: string,
    ): CancelablePromise<Tier> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tiers/{tierID}',
            path: {
                'tierID': tierId,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
