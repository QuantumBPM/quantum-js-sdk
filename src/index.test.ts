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
    // Regression test for the positional-drift bug where opts.page
    // was passed into the hasIncident slot of the generated
    // listBpmnInstances(projectId, definitionId, status, hasIncident,
    // page, pageSize) signature. Pre-fix, calling with page=2 sent
    // hasIncident=true (truthy) and dropped pagination entirely.
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
            page: 2,
            pageSize: 10,
        });

        expect(calls).toHaveLength(1);
        // Generated signature: (projectId, definitionId, status,
        // hasIncident, page, pageSize). Each option must land in
        // its matching slot.
        expect(calls[0]).toEqual([projectId, 'def-1', 'RUNNING', true, 2, 10]);
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

        // page must go to the page slot (5th), NOT the hasIncident slot
        // (4th). The 4th arg must be undefined.
        expect(calls[0]).toEqual([projectId, undefined, undefined, undefined, 3, undefined]);
    });
});
