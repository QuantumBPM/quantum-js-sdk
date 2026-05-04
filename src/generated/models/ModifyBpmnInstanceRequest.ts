/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModificationInstruction } from './ModificationInstruction';
/**
 * Payload for an ad-hoc modification of a running instance. Instructions are applied in order.
 */
export type ModifyBpmnInstanceRequest = {
    instructions: Array<ModificationInstruction>;
};

