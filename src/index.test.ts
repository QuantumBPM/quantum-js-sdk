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
            3,
            undefined,
        ]);
    });
});
