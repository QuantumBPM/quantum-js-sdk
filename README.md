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
- Axios-based HTTP client
- Automatic token injection for authentication
- Tree-shakeable - import only what you need

## Quick Start

```typescript
import { createClient, DmnEngine, FeelValue, ZitadelTokenProvider } from '@quantumdmn/sdk';

// 1. Setup Authentication
// For backend services, use ZitadelTokenProvider with a service account key
const tokenProvider = new ZitadelTokenProvider(
    './service-account.json', 
    'https://auth.quantumdmn.com', 
    'your-zitadel-project-id'
);

// 2. Initialize Client
const client = createClient({
    baseUrl: 'https://api.quantumdmn.com',
    tokenProvider: tokenProvider.getProvider(),
});

// 3. Initialize Engine client
const engine = new DmnEngine(client, 'your-project-id');

// 4. Prepare Context
const context = {
    age: FeelValue.ofNumber(25),
    income: FeelValue.ofNumber(50000),
    role: FeelValue.ofString('admin'),
    active: FeelValue.ofBoolean(true)
    // Or let auto-inference handle it:
    // ...FeelValue.from({ other: 123 }).asContext()
};

// 5. Evaluate Decision
try {
    const result = await engine.evaluate('your-definition-id', context);
    console.log('Result:', result);
} catch (error) {
    console.error('Evaluation failed:', error);
}
```

## Authentication

The SDK provides built-in support for Service Account authentication via `ZitadelTokenProvider`.

### Service Account Authentication (Node.js)

1.  Download your Service Account JSON key file.
2.  Install required dependencies:
    ```bash
    npm install jsonwebtoken
    ```
3.  Use `ZitadelTokenProvider`:

```typescript
import { ZitadelTokenProvider } from '@quantumdmn/sdk';

const auth = new ZitadelTokenProvider(
    '/path/to/key.json',           // Path to JSON key file
    'https://auth.quantumdmn.com', // Auth Server URL
    'your-zitadel-project-id'      // Project ID (numeric) for audience scope
);

// Get a raw token if needed
const token = await auth.getToken();
```

### Manual Token Handling

If you are using a different authentication method or running in the browser with an existing token:

```typescript
import { createClientWithToken } from '@quantumdmn/sdk';

const client = createClientWithToken('https://api.quantumdmn.com', 'your-access-token');
```

## Type-Safe FEEL Values

The `FeelValue` class ensures type safety when working with DMN Data Types.

```typescript
import { FeelValue } from '@quantumdmn/sdk';

// Creation
const num = FeelValue.ofNumber(10);
const str = FeelValue.ofString('hello');
const bool = FeelValue.ofBoolean(true);
const list = FeelValue.ofList([num, str]);
const ctx = FeelValue.ofContext({ field: num });

// Inference
const fromRaw = FeelValue.from({ 
    amount: 1000, 
    currency: 'USD',
    tags: ['sales', 'Q1'] 
});

// Unwrapping
const raw = fromRaw.toRaw(); // { amount: 1000, ... }
const numVal = num.asNumber(); // 10
```

## API Reference

### DmnEngine
- `evaluate(xmlDefinitionId: string, context: Record<string, FeelValue>)`: Evaluate a deployed definition.

### Client Helpers
All generated API methods are available via `createClient().default`.

- `listProjects()`
- `createDefinition()`
- `evaluateStored()`
- `...and more`

## License

MIT License - see [LICENSE](LICENSE) for details.
