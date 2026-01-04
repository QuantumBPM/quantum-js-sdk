import { DmnClient } from './generated/DmnClient';
import { EvaluationResult } from './generated/models/EvaluationResult';
import { EvaluateStoredRequest } from './generated/models/EvaluateStoredRequest';
import { FeelValue } from './model/FeelValue';

export class DmnEngine {
    constructor(
        private readonly client: DmnClient,
        private readonly projectId: string
    ) { }

    /**
     * Evaluate a decision by its XML ID.
     * @param xmlId The decision ID from the XML definition.
     * @param context The input context (raw object or dictionary of DmnValues).
     * @param version Optional version of the decision model.
     */
    async evaluate(
        xmlId: string,
        context: Record<string, any>,
        version?: number
    ): Promise<Record<string, EvaluationResult>> {

        // 1. Wrap context in DmnValues if not already
        const feelContext: Record<string, FeelValue> = {};
        for (const [key, value] of Object.entries(context)) {
            feelContext[key] = FeelValue.from(value);
        }

        // 2. Prepare Request
        // Note: The generated SDK expects 'context' to be serialized properly.
        // Since DmnValue.toJSON() returns raw values, it should work fine with standard JSON serialization
        // used by the generated Axios client, provided the API expects standard JSON types.
        // However, if the API strictly expects a specific FeelValue structure in JSON, 
        // we might need to adjust. Based on .NET/Java SDKs, it seems the API accepts standard JSON maps.

        const request: EvaluateStoredRequest = {
            context: feelContext as any // The generated types might be slightly off regarding custom classes
        };

        const response = await this.client.default.evaluateByXmlid(
            this.projectId,
            xmlId,
            request,
            version
        );

        return response as Record<string, EvaluationResult>;
    }
}
