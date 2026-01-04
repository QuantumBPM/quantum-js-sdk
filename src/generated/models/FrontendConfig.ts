/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FrontendConfig = {
    oidc: {
        /**
         * OIDC authority URL (issuer)
         */
        authority: string;
        /**
         * OIDC client ID for the web application
         */
        clientId: string;
    };
    paddle?: {
        /**
         * Paddle client-side token for checkout
         */
        clientToken?: string;
        /**
         * Whether to use Paddle sandbox environment
         */
        sandbox?: boolean;
    };
};

