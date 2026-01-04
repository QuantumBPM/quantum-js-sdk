import { createClient, createClientWithToken, DmnClient } from './index';

describe('QuantumDMN SDK', () => {
    test('createClientWithToken returns DmnClient instance', () => {
        const client = createClientWithToken('https://api.quantumdmn.com', 'test-token');
        expect(client).toBeInstanceOf(DmnClient);
    });

    test('createClient with token provider returns DmnClient instance', () => {
        let callCount = 0;
        const client = createClient({
            baseUrl: 'https://api.quantumdmn.com',
            tokenProvider: async () => {
                callCount++;
                return 'dynamic-token';
            },
        });
        expect(client).toBeInstanceOf(DmnClient);
    });
});
