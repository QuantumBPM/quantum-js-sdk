/**
 * Authentication helpers: the TokenProvider interface, ClientCredentialsTokenProvider
 * for any OIDC provider, and StaticTokenProvider for a fixed bearer token.
 */
import axios from 'axios';

import { RawClient } from './generated/RawClient';

/** A TokenProvider returns a valid bearer token for the next request. */
export interface TokenProvider {
    getToken(): Promise<string>;
}

/** Long-lived bearer token. Useful for Enterprise API keys and tests. */
export class StaticTokenProvider implements TokenProvider {
    constructor(private readonly token: string) {}

    async getToken(): Promise<string> {
        return this.token;
    }
}

/** Options for ClientCredentialsTokenProvider. */
export interface ClientCredentialsOptions {
    /** The identity provider's OAuth 2.0 token endpoint. */
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    /** Sent space-joined as the `scope` parameter. Empty sends none. */
    scopes?: string[];
    /** Sent as the `audience` parameter when set. Some providers, such as Auth0, require it. */
    audience?: string;
}

const REFRESH_MARGIN_MS = 60_000;
const DEFAULT_LIFETIME_S = 300;

/**
 * Fetches access tokens from any OIDC provider with the OAuth 2.0 client
 * credentials grant. The token is cached until less than 60 seconds of its
 * lifetime remain, and parallel callers share one in-flight request.
 */
export class ClientCredentialsTokenProvider implements TokenProvider {
    private accessToken: string | null = null;
    private expiresAt = 0;
    private inFlight: Promise<string> | null = null;

    constructor(private readonly options: ClientCredentialsOptions) {
        if (!options.tokenUrl || !options.clientId || !options.clientSecret) {
            throw new Error('quantumbpm: tokenUrl, clientId and clientSecret are required');
        }
    }

    async getToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.expiresAt - REFRESH_MARGIN_MS) {
            return this.accessToken;
        }
        if (!this.inFlight) {
            this.inFlight = this.fetchToken().finally(() => {
                this.inFlight = null;
            });
        }
        return this.inFlight;
    }

    private async fetchToken(): Promise<string> {
        const { tokenUrl, clientId, clientSecret, scopes, audience } = this.options;
        const form = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        });
        if (scopes && scopes.length > 0) form.set('scope', scopes.join(' '));
        if (audience) form.set('audience', audience);

        const requestedAt = Date.now();
        const response = await axios.post<string>(tokenUrl, form.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            responseType: 'text',
            validateStatus: () => true,
        });
        if (response.status < 200 || response.status > 299) {
            throw new Error(`quantumbpm: token request failed (${response.status}): ${response.data}`);
        }

        let body: { access_token?: unknown; expires_in?: unknown };
        try {
            body = JSON.parse(response.data);
        } catch {
            throw new Error(`quantumbpm: token response is not JSON: ${response.data}`);
        }
        if (typeof body.access_token !== 'string' || !body.access_token) {
            throw new Error('quantumbpm: token response has no access_token');
        }
        const expiresIn = body.expires_in == null ? DEFAULT_LIFETIME_S : Number(body.expires_in);
        if (!Number.isFinite(expiresIn)) {
            throw new Error(`quantumbpm: token response has an invalid expires_in: ${body.expires_in}`);
        }

        this.accessToken = body.access_token;
        this.expiresAt = requestedAt + expiresIn * 1000;
        return this.accessToken;
    }
}

/**
 * Build a generated RawClient that injects the supplied TokenProvider's
 * bearer token on every request.
 */
export function createAuthenticatedClient(
    baseUrl: string,
    provider: TokenProvider,
): RawClient {
    return new RawClient({
        BASE: baseUrl,
        TOKEN: () => provider.getToken(),
    });
}
