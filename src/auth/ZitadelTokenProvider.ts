import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { TokenProvider } from '../index';

export class ZitadelTokenProvider {
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;
    private keyData: any;

    constructor(
        private readonly keyFile: string,
        private readonly issuer: string,
        private readonly projectId?: string
    ) {
        const fileContent = fs.readFileSync(this.keyFile, 'utf-8');
        this.keyData = JSON.parse(fileContent);
    }

    private createJwtAssertion(): string {
        const now = Math.floor(Date.now() / 1000);
        const payload: any = {
            iss: this.keyData.userId,
            sub: this.keyData.userId,
            aud: this.issuer,
            iat: now,
            exp: now + 3600, // 1 hour
        };

        return jwt.sign(payload, this.keyData.key, { algorithm: 'RS256', keyid: this.keyData.keyId });
    }

    public async getToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
            return this.accessToken;
        }

        const assertion = this.createJwtAssertion();

        // Construct scopes
        const scopes = ['openid', 'profile', 'urn:zitadel:iam:user:resourceowner'];
        if (this.projectId) {
            scopes.push('urn:zitadel:iam:org:projects:roles');
            scopes.push(`urn:zitadel:iam:org:project:id:${this.projectId}:aud`);
        }

        try {
            const response = await axios.post(
                `${this.issuer}/oauth/v2/token`,
                new URLSearchParams({
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    scope: scopes.join(' '),
                    assertion: assertion,
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
            return this.accessToken!;
        } catch (error: any) {
            console.error('Failed to fetch Zitadel token:', error.response?.data || error.message);
            throw error;
        }
    }

    public getProvider(): TokenProvider {
        return () => this.getToken();
    }
}
