# QuantumDMN JavaScript/TypeScript SDK

Official TypeScript/JavaScript SDK for the [QuantumDMN](https://quantumdmn.com) DMN Engine API.

## Installation

```bash
npm install @quantumdmn/sdk
# or
yarn add @quantumdmn/sdk
```

## Features

- Full TypeScript support with complete type definitions
- Axios-based HTTP client (works in browser and Node.js)
- Automatic token injection for authentication
- Tree-shakeable - import only what you need

## Quick Start

```typescript
import { initClient, listProjects, evaluateStored } from '@quantumdmn/sdk';

// initialize with your token provider
initClient({
  baseUrl: 'https://api.quantumdmn.com',
  tokenProvider: () => getAccessToken(), // implement your auth logic
});

// list projects
const { data: projects } = await listProjects();
console.log(projects?.map(p => p.name));

// evaluate a decision
const { data: result } = await evaluateStored({
  path: { projectID: 'your-project-id', definitionID: 'your-definition-id' },
  body: {
    context: { age: 25, income: 50000 }
  }
});
```

## Authentication

The SDK uses a token provider pattern for authentication. Implement a function that returns a valid access token:

```typescript
// with static token
import { initClientWithToken } from '@quantumdmn/sdk';
initClientWithToken('https://api.quantumdmn.com', 'your-static-token');

// with dynamic token (recommended for production)
import { initClient } from '@quantumdmn/sdk';
initClient({
  baseUrl: 'https://api.quantumdmn.com',
  tokenProvider: async () => {
    // implement Zitadel JWT Profile or your auth logic
    return await fetchTokenFromZitadel();
  }
});
```

### Authentication with Zitadel JSON Key (Node.js)

When running in a Node.js environment (e.g., backend service), you can use a Service Account JSON Key.

**Required:** `npm install jsonwebtoken`

```typescript
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { initClient } from '@quantumdmn/sdk';

const key = JSON.parse(readFileSync('./service-account.json', 'utf-8'));
const ISSUER_URL = 'https://auth.quantumdmn.com';

async function getAccessToken() {
    // 1. Sign JWT
    const token = jwt.sign({}, key.key, {
        algorithm: 'RS256',
        issuer: key.userId,
        subject: key.userId,
        audience: ISSUER_URL,
        expiresIn: '1h',
        keyid: key.keyId,
    });

    // 2. Exchange for Access Token
    const params = new URLSearchParams();
    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
    params.append('assertion', token);
    params.append('scope', 'openid profile urn:zitadel:iam:user:resourceowner');

    const resp = await fetch(`${ISSUER_URL}/oauth/v2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    
    const data = await resp.json();
    return data.access_token;
}

// Initialize
initClient({
    baseUrl: 'https://api.quantumdmn.com',
    tokenProvider: getAccessToken,
});
```

## API Reference

All API methods are exported directly. Common operations:

### Projects
- `listProjects()` - List all projects
- `createProject({ body })` - Create a new project
- `getProject({ path: { projectID } })` - Get project details
- `deleteProject({ path: { projectID } })` - Delete a project

### Definitions
- `listDefinitions({ path: { projectID } })` - List definitions
- `createDefinition({ path: { projectID }, body })` - Create definition  
- `getDefinition({ path: { projectID, definitionID } })` - Get definition
- `updateDefinition({ path: { projectID, definitionID }, body })` - Update definition

### Evaluation
- `evaluateStored({ path: { projectID, definitionID }, body })` - Evaluate stored definition
- `evaluateDesign({ body })` - Evaluate inline DMN XML

### Executions
- `listExecutions({ path: { projectID, definitionID } })` - List executions
- `getExecution({ path: { projectID, executionID } })` - Get execution details

## License

MIT License - see [LICENSE](LICENSE) for details.
