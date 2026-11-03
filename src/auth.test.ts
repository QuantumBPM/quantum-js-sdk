import * as http from 'http';
import { AddressInfo } from 'net';

import { ClientCredentialsTokenProvider, ClientCredentialsOptions } from './auth';

interface TokenStub {
    url: string;
    forms: URLSearchParams[];
    contentTypes: (string | undefined)[];
    close(): Promise<void>;
}

// Answers every request with status and the body built by respond, which
// receives the 1-based request number.
async function startStub(status: number, respond: (n: number) => string): Promise<TokenStub> {
    const forms: URLSearchParams[] = [];
    const contentTypes: (string | undefined)[] = [];
    const server = http.createServer((req, res) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
            forms.push(new URLSearchParams(body));
            contentTypes.push(req.headers['content-type']);
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(respond(forms.length));
        });
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as AddressInfo;
    return {
        url: `http://127.0.0.1:${port}/token`,
        forms,
        contentTypes,
        close: () => new Promise((resolve) => server.close(() => resolve())),
    };
}

const tokenJson = (expiresIn: string) => (n: number) =>
    `{"access_token":"token-${n}","token_type":"Bearer"${expiresIn}}`;

function provider(stub: TokenStub, extra: Partial<ClientCredentialsOptions> = {}) {
    return new ClientCredentialsTokenProvider({
        tokenUrl: stub.url,
        clientId: 'my-client',
        clientSecret: 'my-secret',
        ...extra,
    });
}

describe('ClientCredentialsTokenProvider', () => {
    let stub: TokenStub;

    afterEach(async () => {
        await stub?.close();
    });

    test('sends the grant with scopes and audience', async () => {
        stub = await startStub(200, tokenJson(',"expires_in":3600'));
        await provider(stub, { scopes: ['openid', 'bpm.api'], audience: 'quantumbpm-api' }).getToken();

        expect(stub.contentTypes[0]).toBe('application/x-www-form-urlencoded');
        expect(Object.fromEntries(stub.forms[0])).toEqual({
            grant_type: 'client_credentials',
            client_id: 'my-client',
            client_secret: 'my-secret',
            scope: 'openid bpm.api',
            audience: 'quantumbpm-api',
        });
    });

    test('omits scope and audience when not set', async () => {
        stub = await startStub(200, tokenJson(',"expires_in":3600'));
        await provider(stub, { scopes: [] }).getToken();

        expect(Object.fromEntries(stub.forms[0])).toEqual({
            grant_type: 'client_credentials',
            client_id: 'my-client',
            client_secret: 'my-secret',
        });
    });

    test.each([
        ['a number', ',"expires_in":3600'],
        ['a numeric string', ',"expires_in":"3600"'],
        ['missing', ''],
    ])('reuses the cached token when expires_in is %s', async (_name, expiresIn) => {
        stub = await startStub(200, tokenJson(expiresIn));
        const p = provider(stub);

        expect(await p.getToken()).toBe('token-1');
        expect(await p.getToken()).toBe('token-1');
        expect(stub.forms).toHaveLength(1);
    });

    test('refreshes a token near expiry', async () => {
        // 30 seconds is inside the 60 second refresh margin.
        stub = await startStub(200, tokenJson(',"expires_in":30'));
        const p = provider(stub);

        expect(await p.getToken()).toBe('token-1');
        expect(await p.getToken()).toBe('token-2');
        expect(stub.forms).toHaveLength(2);
    });

    test('parallel callers share one request', async () => {
        stub = await startStub(200, tokenJson(',"expires_in":3600'));
        const p = provider(stub);

        const tokens = await Promise.all(Array.from({ length: 5 }, () => p.getToken()));

        expect(tokens).toEqual(Array(5).fill('token-1'));
        expect(stub.forms).toHaveLength(1);
    });

    test('rejects with the status and body on 401', async () => {
        stub = await startStub(401, () => '{"error":"invalid_client"}');

        await expect(provider(stub).getToken()).rejects.toThrow(/401.*invalid_client/);
    });

    test('requires tokenUrl, clientId and clientSecret', () => {
        expect(() => new ClientCredentialsTokenProvider({
            tokenUrl: 'http://127.0.0.1:1/token',
            clientId: 'my-client',
            clientSecret: '',
        })).toThrow(/required/);
    });
});
