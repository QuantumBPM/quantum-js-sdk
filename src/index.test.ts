import {
    QuantumBPM,
    Vars,
    StaticTokenProvider,
    ClientCredentialsTokenProvider,
    DmnClient,
    BpmnClient,
    Worker,
    BpmnError,
    RawClient,
} from './index';

describe('public API surface', () => {
    test('top-level exports are defined', () => {
        expect(QuantumBPM).toBeDefined();
        expect(Vars).toBeDefined();
        expect(StaticTokenProvider).toBeDefined();
        expect(ClientCredentialsTokenProvider).toBeDefined();
        expect(DmnClient).toBeDefined();
        expect(BpmnClient).toBeDefined();
        expect(Worker).toBeDefined();
        expect(BpmnError).toBeDefined();
        expect(RawClient).toBeDefined();
    });

    test('Vars round-trips a value', () => {
        const vars = new Vars().set('amount', 1000);
        expect(vars.lookup('amount')).toBe(1000);
    });
});

describe('BpmnClient.listInstances argument ordering', () => {
    test('forwards each option to its matching generated parameter', async () => {
        const calls: unknown[][] = [];
        const fakeRaw = {
            default: {
                listBpmnInstances: (...args: unknown[]) => {
                    calls.push(args);
                    return Promise.resolve({ data: [], totalCount: 0 });
                },
            },
        } as never;
        const projectId = '00000000-0000-0000-0000-000000000001';
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.listInstances({
            status: 'RUNNING',
            hasIncident: true,
            suspended: false,
            createdAfter: '2026-01-01T00:00:00Z',
            businessId: 'ORDER-42',
            processId: 'order_flow',
            version: 3,
            draft: true,
            cursor: 'next-page',
            limit: 10,
        });

        expect(calls).toHaveLength(1);
        expect(calls[0]).toEqual([
            projectId,
            'RUNNING',
            true,
            false,
            '2026-01-01T00:00:00Z',
            'ORDER-42',
            'order_flow',
            3,
            true,
            'next-page',
            10,
        ]);
    });

    test('omits unset options without sliding values into wrong slots', async () => {
        const calls: unknown[][] = [];
        const fakeRaw = {
            default: {
                listBpmnInstances: (...args: unknown[]) => {
                    calls.push(args);
                    return Promise.resolve({ data: [], totalCount: 0 });
                },
            },
        } as never;
        const projectId = '00000000-0000-0000-0000-000000000001';
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.listInstances({ cursor: 'next-page' });

        expect(calls[0]).toEqual([
            projectId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'next-page',
            undefined,
        ]);
    });
});

describe('BpmnClient user task list argument ordering', () => {
    const projectId = '00000000-0000-0000-0000-000000000001';

    test('listUserTasks and listUserTasksForCaller forward cursor and limit last', async () => {
        const calls: unknown[][] = [];
        const record = (...args: unknown[]) => {
            calls.push(args);
            return Promise.resolve({ data: [], pagination: {} });
        };
        const fakeRaw = { bpmn: { listBpmnUserTasks: record, listBpmnUserTasksForCaller: record } } as never;
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.listUserTasks({ instanceId: 'inst-1', status: 'CREATED', cursor: 'next-page', limit: 5 });
        await client.listUserTasksForCaller({ cursor: 'next-page', limit: 5 });
        await client.listUserTasks({ dueBefore: '2026-11-10T12:00:00Z', sort: 'dueDate' });
        await client.listUserTasksForCaller({ dueAfter: '2026-11-10T12:00:00Z', sort: 'priority' });

        expect(calls[0]).toEqual([
            projectId, 'inst-1', 'CREATED', undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, 'next-page', 5,
        ]);
        expect(calls[1]).toEqual([projectId, undefined, undefined, undefined, 'next-page', 5]);
        expect(calls[2]).toEqual([
            projectId, undefined, undefined, undefined, undefined, undefined, undefined,
            undefined, '2026-11-10T12:00:00Z', 'dueDate', undefined, undefined,
        ]);
        expect(calls[3]).toEqual([projectId, '2026-11-10T12:00:00Z', undefined, 'priority', undefined, undefined]);
    });
});

describe('BpmnClient history and version argument ordering', () => {
    const projectId = '00000000-0000-0000-0000-000000000001';

    test('forward each option to its matching generated parameter', async () => {
        const calls: unknown[][] = [];
        const record = (...args: unknown[]) => {
            calls.push(args);
            return Promise.resolve({});
        };
        const fakeRaw = {
            bpmn: { getBpmnInstanceHistory: record, getBpmnInstanceHistoryEntry: record, getBpmnProcessVersion: record },
        } as never;
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.getInstanceHistory('inst-1', { fromSeq: 4, beforeSeq: 9, limit: 50 });
        await client.getInstanceHistory('inst-1', { beforeSeq: 9 });
        await client.getInstanceHistoryEntry('inst-1', 7);
        await client.getProcessVersion('order_flow', 3, { createdAfter: '2026-01-01T00:00:00Z' });

        expect(calls).toEqual([
            [projectId, 'inst-1', 4, 9, 50],
            [projectId, 'inst-1', undefined, 9, undefined],
            [projectId, 'inst-1', 7],
            [projectId, 'order_flow', 3, '2026-01-01T00:00:00Z'],
        ]);
    });
});

describe('BpmnClient businessId threading', () => {
    const projectId = '00000000-0000-0000-0000-000000000001';

    test('startInstance forwards businessId in the request body', async () => {
        const bodies: Array<Record<string, unknown>> = [];
        const fakeRaw = {
            default: {
                startBpmnInstance: (_projectId: string, body: Record<string, unknown>) => {
                    bodies.push(body);
                    return Promise.resolve({ instanceID: 'wf-1' });
                },
            },
        } as never;
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.startInstance('def-1', new Vars().set('amount', 100), { businessId: 'ORDER-42' });

        expect(bodies[0]?.businessId).toBe('ORDER-42');
    });

    test('startInstance omits businessId when no option is passed', async () => {
        const bodies: Array<Record<string, unknown>> = [];
        const fakeRaw = {
            default: {
                startBpmnInstance: (_projectId: string, body: Record<string, unknown>) => {
                    bodies.push(body);
                    return Promise.resolve({ instanceID: 'wf-1' });
                },
            },
        } as never;
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.startInstance('def-1', new Vars());

        expect(bodies[0]?.businessId).toBeUndefined();
    });

    test('listUserTasks forwards businessId in positional argument 7', async () => {
        const calls: unknown[][] = [];
        const fakeRaw = {
            bpmn: {
                listBpmnUserTasks: (...args: unknown[]) => {
                    calls.push(args);
                    return Promise.resolve({ data: [], pagination: {} });
                },
            },
        } as never;
        const { BpmnClient } = await import('./bpmn');
        const client = new BpmnClient(fakeRaw, projectId);

        await client.listUserTasks({ businessId: 'ORDER-42' });

        expect(calls[0]).toEqual([
            projectId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'ORDER-42',
            undefined,
            undefined,
        ]);
    });
});

describe('DmnClient businessId threading', () => {
    const projectId = '00000000-0000-0000-0000-000000000001';

    test('evaluate forwards businessId in the request body', async () => {
        const bodies: Array<Record<string, unknown>> = [];
        const fakeRaw = {
            default: {
                evaluateByDefinitionsId: (_pid: string, _did: string, body: Record<string, unknown>) => {
                    bodies.push(body);
                    return Promise.resolve({});
                },
            },
        } as never;
        const { DmnClient } = await import('./dmn');
        const client = new DmnClient(fakeRaw, projectId);

        await client.evaluate('def-1', new Vars(), { businessId: 'ORDER-42' });

        expect(bodies[0]?.businessId).toBe('ORDER-42');
    });
});
