import {
    QuantumBPM,
    Vars,
    StaticTokenProvider,
    ZitadelTokenProvider,
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
        expect(ZitadelTokenProvider).toBeDefined();
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
            definitionId: 'def-1',
            status: 'RUNNING',
            hasIncident: true,
            suspended: false,
            createdAfter: '2026-01-01T00:00:00Z',
            businessId: 'ORDER-42',
            page: 2,
            pageSize: 10,
        });

        expect(calls).toHaveLength(1);
        expect(calls[0]).toEqual([
            projectId,
            'def-1',
            'RUNNING',
            true,
            false,
            '2026-01-01T00:00:00Z',
            'ORDER-42',
            2,
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

        await client.listInstances({ page: 3 });

        expect(calls[0]).toEqual([
            projectId,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            3,
            undefined,
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
                    return Promise.resolve({ workflowID: 'wf-1' });
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
                    return Promise.resolve({ workflowID: 'wf-1' });
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

    test('evaluateById forwards businessId in the request body', async () => {
        const bodies: Array<Record<string, unknown>> = [];
        const fakeRaw = {
            default: {
                evaluateStored: (_pid: string, _did: string, body: Record<string, unknown>) => {
                    bodies.push(body);
                    return Promise.resolve({});
                },
            },
        } as never;
        const { DmnClient } = await import('./dmn');
        const client = new DmnClient(fakeRaw, projectId);

        await client.evaluateById('11111111-1111-1111-1111-111111111111', new Vars(), {
            businessId: 'ORDER-42',
        });

        expect(bodies[0]?.businessId).toBe('ORDER-42');
    });
});
