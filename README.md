# QuantumBPM TypeScript/JavaScript SDK

Official TypeScript/JavaScript SDK for the [QuantumBPM](https://quantumbpm.com) platform - DMN evaluation, BPMN process orchestration, and external job workers.

## Installation

```bash
npm install @quantumbpm/sdk
```

Node.js 18+ (uses native `AbortController` and `AbortSignal`).

## What's in the box

| Module                                            | Purpose                                                                       |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| `QuantumBPM`                                      | Top-level client exposing `.dmn` and `.bpmn`, plus `newWorker(...)`           |
| `ZitadelTokenProvider`, `StaticTokenProvider`     | Authentication. Implement `TokenProvider` for BYO providers                   |
| `DmnClient`                                       | DMN evaluation: stored definitions, ad-hoc XML, batch                         |
| `BpmnClient`                                      | BPMN resources, instances, messaging, user tasks, processes                   |
| `Worker`                                          | External job worker runtime - long-poll, lock heartbeat, dispatch             |
| `Vars`                                            | Variables wrapper with typed accessors and FEEL-context conversion            |
| `RawClient`                                       | OpenAPI-generated client. Reachable via `client.raw`, never hand-edited       |

## Quick start

```typescript
import { QuantumBPM, Vars, ZitadelTokenProvider } from '@quantumbpm/sdk';

const provider = new ZitadelTokenProvider(
    './service-account.json',         // Zitadel JSON Key file
    'https://auth.quantumbpm.com',    // issuer
    'your-zitadel-project-id',        // audience scope
);

const client = new QuantumBPM({
    baseUrl: 'https://api.quantumbpm.com',
    projectId: '00000000-0000-0000-0000-000000000000',
    tokenProvider: provider,
});

const result = await client.dmn.evaluate(
    'loan-eligibility',
    new Vars().set('requestedAmt', 1000).set('creditScore', 720),
);
console.log(result);
```

## Authentication

The `TokenProvider` interface returns a bearer token on each request. Two implementations ship out of the box.

### Zitadel service account

```typescript
const provider = new ZitadelTokenProvider(
    './service-account.json',         // path to JSON Key file
    'https://auth.quantumbpm.com',    // issuer URL
    'your-zitadel-project-id',        // adds the audience scope
);
```

The provider caches tokens in-memory until shortly before expiry.

### Static bearer token

For Enterprise deployments that issue long-lived API keys, or in tests where a token is acquired out of band:

```typescript
import { StaticTokenProvider } from '@quantumbpm/sdk';

const provider = new StaticTokenProvider('eyJhbGciOi...');
```

### Bring your own

Implement the interface:

```typescript
import { TokenProvider } from '@quantumbpm/sdk';

class MyProvider implements TokenProvider {
    async getToken(): Promise<string> {
        // ... your auth logic
        return token;
    }
}
```

## DMN evaluation

The `client.dmn` sub-client offers four methods.

### Evaluate a stored definition

```typescript
const result = await client.dmn.evaluate(
    'loan-eligibility',
    new Vars().set('requestedAmt', 5000).set('creditScore', 720),
);
```

Returns `Record<string, EvaluationResult>` keyed by decision name. Each result has `value`, `hitRules`, `error`, and `type`.

Pin a version, restrict the evaluated decisions, or attach decision services:

```typescript
const result = await client.dmn.evaluate('loan-eligibility', vars, {
    version: 3,
    decisions: ['eligibility', 'rate'],
});
```

### Evaluate by platform UUID

When you already hold a database-version pointer:

```typescript
const result = await client.dmn.evaluateById(definitionUuid, vars);
```

### Ad-hoc XML evaluation

For "evaluate while editing" flows that don't store the XML:

```typescript
const result = await client.dmn.evaluateDesign(dmnXml, vars, {
    additionalXMLs: [importedXml1, importedXml2],
    decisions: ['eligibility'],
});
```

### Batch ad-hoc evaluation

```typescript
const rows = [
    new Vars().set('requestedAmt', 1000),
    new Vars().set('requestedAmt', 5000),
    new Vars().set('requestedAmt', 25000),
];
const batch = await client.dmn.evaluateDesignBatch(dmnXml, rows);
```

## BPMN processes

`client.bpmn` covers the full BPMN runtime surface.

### Deploy and start

```typescript
// Stage a BPMN draft, then deploy it.
const draft = await client.bpmn.createResource('loan-process', bpmnXml);
await client.bpmn.deployResource(draft.id);

// Re-fetch to get the populated process-definition list.
const deployed = await client.bpmn.getResource(draft.id);
const processDef = deployed.processes![0];

// Start an instance.
const workflowId = await client.bpmn.startInstance(
    processDef.id,
    new Vars().set('applicantID', 'u-123').set('requestedAmt', 25000),
);
```

### Inspect runtime state

```typescript
const state = await client.bpmn.getInstance(workflowId);
console.log(state.status, state.activeScopes);

const vars = await client.bpmn.getInstanceVariables(workflowId);

const children = await client.bpmn.getInstanceChildren(workflowId);
```

### Send messages and signals

```typescript
await client.bpmn.publishMessage(
    'loan-approved',
    new Vars().set('approvedAmt', 24000),
    {
        correlationKeys: { /* ... */ },
        ttl: 'PT5M',
    },
);

await client.bpmn.publishSignal('system-maintenance', new Vars());
```

### User tasks

```typescript
const page = await client.bpmn.listUserTasks({
    assignee: 'alice@example.com',
    status: 'CREATED',
});

await client.bpmn.completeUserTask(executionKey, new Vars().set('approved', true));

// Or fail with a BPMN error code (matches boundary error events):
await client.bpmn.throwUserTaskError(executionKey, 'REVIEW_REJECTED', new Vars());
```

## External job workers

Workers handle service tasks asynchronously. Register a handler per task type, then call `run`. The runtime owns long-polling, lock heartbeats, dispatch, and outcome mapping.

### Minimal worker

```typescript
import { QuantumBPM, Vars, BpmnError } from '@quantumbpm/sdk';

const ac = new AbortController();
const worker = client.newWorker({ clientId: 'billing-svc' });

worker.handle('send-email', async (job) => {
    const recipient = job.vars.get<string>('recipient');
    const subject = job.vars.get<string>('subject');

    await emailer.send(recipient, subject);
    return new Vars().set('messageID', 'msg-123');  // → Complete
});

await worker.run(ac.signal);
```

`run()` resolves when the AbortSignal is triggered, after in-flight handlers settle.

### Concurrency, polling, and locks

```typescript
worker.handle('send-email', handler, {
    maxJobs: 10,                // up to 10 in flight per task type
    pollTimeout: '45s',         // long-poll wait
    lockDuration: '2m',         // exclusive lock per job
});
```

Concurrency is per task type. Different task types run independently. The runtime auto-renews the lock at half the lock-duration interval while the handler runs.

### Throwing typed BPMN errors

Throw a `BpmnError` to fail the job with a code that boundary error events on the originating service task can catch:

```typescript
worker.handle('charge-card', async (job) => {
    try {
        const txId = await charge(job.vars.toRecord());
        return new Vars().set('transactionID', txId);
    } catch (err) {
        if (err.code === 'INSUFFICIENT_FUNDS') {
            throw new BpmnError('INSUFFICIENT_FUNDS', new Vars().set('availableBalance', 12.0));
        }
        throw err;  // → ThrowError("WORKER_ERROR"); retry budget decrements
    }
});
```

Handlers that throw anything other than `BpmnError` report `WORKER_ERROR` and the server treats it as a retryable failure.

### Typed handlers

Generic on `handle()` decodes the job's input variables into a typed shape. The SDK does not validate at runtime - TypeScript treats it as a hint:

```typescript
interface EmailJob {
    recipient: string;
    subject: string;
}

worker.handle<EmailJob>('send-email', async (job) => {
    // job.typed is EmailJob
    await emailer.send(job.typed.recipient, job.typed.subject);
    return new Vars().set('messageID', 'msg-123');
});
```

## Variables

`Vars` is a thin wrapper around `Record<string, unknown>` shared by DMN, BPMN, and workers.

### Construction

```typescript
const v = new Vars().set('amount', 100).set('name', 'Alice');
const v = Vars.from({ amount: 100, name: 'Alice' });
```

### Typed access

```typescript
const amount = v.get<number>('amount');
const flag   = v.get<boolean>('approved');

interface Loan {
    requestedAmt: number;
    approved: boolean;
}
const loan = v.as<Loan>();
```

`get<T>` and `as<T>` are TypeScript hints - no runtime validation. Combine with a runtime validator (e.g. Zod) at boundaries when you need it.

### Number precision

FEEL numbers are exact decimals server-side, but this SDK deserializes JSON with `JSON.parse`, so numbers arrive as IEEE-754 doubles (~15–17 significant digits). Values beyond double precision - e.g. `1234567890.123456789012345678` - are silently rounded on receipt, and echoing them back sends the rounded value. This is a JavaScript platform limitation; the Go, Java, and Python SDKs preserve exact decimals.

If you need currency-grade round-trips through a JS worker or client, represent those values as FEEL **strings** in your processes and convert with a decimal library (e.g. `decimal.js`, `big.js`) at the edges.

## Escape hatch

The `client.raw` property exposes the underlying generated client for endpoints not yet wrapped (instance migration, modification, ad-hoc triggers, batch job complete/error, etc.):

```typescript
await client.raw.bpmn.migrateBpmnInstance(client.projectId, workflowId, body);
```

## License

MIT License - see [LICENSE](LICENSE) for details.
