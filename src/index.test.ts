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
