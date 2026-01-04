export * from './generated';
export { DmnClient } from './generated/DmnClient';

/**
 * Token provider type - returns an access token (or Promise of one)
 */
export type TokenProvider = () => string | Promise<string>;

/**
 * Configuration options for creating a QuantumDMN client
 */
export interface QuantumDMNConfig {
    /** API base URL (e.g., "https://api.quantumdmn.com") */
    baseUrl: string;
    /** Token provider function for authentication */
    tokenProvider: TokenProvider;
}

/**
 * Create a QuantumDMN client with authentication.
 * 
 * @example
 * ```typescript
 * import { createClient } from '@quantumdmn/sdk';
 * 
 * const client = createClient({
 *   baseUrl: 'https://api.quantumdmn.com',
 *   tokenProvider: () => getAccessToken()
 * });
 * 
 * const projects = await client.default.listProjects();
 * ```
 */
export function createClient(config: QuantumDMNConfig) {
    const { DmnClient } = require('./generated/DmnClient');
    return new DmnClient({
        BASE: config.baseUrl,
        TOKEN: config.tokenProvider,
    });
}

/**
 * Create a client with a static token.
 * Useful for testing or when token is managed externally.
 */
export function createClientWithToken(baseUrl: string, token: string) {
    return createClient({
        baseUrl,
        tokenProvider: () => token,
    });
}
