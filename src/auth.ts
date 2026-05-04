/**
 * Authentication helpers. Provides the TokenProvider interface plus two
 * implementations:
 *
 * - ZitadelTokenProvider: service-account JWT-bearer flow against Zitadel,
 *   with in-memory token caching.
 * - StaticTokenProvider: returns the same bearer token on every call.
 */
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
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

interface ZitadelKeyFile {
    userId: string;
    keyId: string;
    key: string;
}

/**
 * Authenticates against Zitadel using a service-account JSON Key file via the
 * JWT Profile (`urn:ietf:params:oauth:grant-type:jwt-bearer`) grant. Tokens
 * are cached until shortly before expiry.
 */
export class ZitadelTokenProvider implements TokenProvider {
    private accessToken: string | null = null;
    private expiresAt = 0;
    private readonly keyData: ZitadelKeyFile;
    private readonly issuer: string;
    private readonly scopes: string[];

    /**
     * @param keyFile  Path to the service-account JSON Key file from Zitadel.
     * @param issuer   Zitadel instance base URL (e.g. https://auth.quantumbpm.com).
     * @param projectId Zitadel project ID. When provided, adds the audience
     *                  scope so issued tokens are accepted by the API.
     */
    constructor(keyFile: string, issuer: string, projectId?: string) {
        const content = fs.readFileSync(keyFile, 'utf-8');
        this.keyData = JSON.parse(content) as ZitadelKeyFile;
        this.issuer = issuer.replace(/\/$/, '');

        const scopes = [
            'openid',
            'profile',
            'urn:zitadel:iam:user:resourceowner',
            'urn:zitadel:iam:org:projects:roles',
        ];
        if (projectId) {
            scopes.push(`urn:zitadel:iam:org:project:id:${projectId}:aud`);
        }
        this.scopes = scopes;
    }

    async getToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.expiresAt - 60_000) {
            return this.accessToken;
        }

        const now = Math.floor(Date.now() / 1000);
        const assertion = jwt.sign(
            {
                iss: this.keyData.userId,
                sub: this.keyData.userId,
                aud: this.issuer,
                iat: now,
                exp: now + 3600,
            },
            this.keyData.key,
            { algorithm: 'RS256', keyid: this.keyData.keyId },
        );

        const response = await axios.post(
            `${this.issuer}/oauth/v2/token`,
            new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                scope: this.scopes.join(' '),
                assertion,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        );

        this.accessToken = response.data.access_token as string;
        this.expiresAt = Date.now() + (response.data.expires_in as number) * 1000;
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
