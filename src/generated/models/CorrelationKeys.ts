/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CorrelationKeyBoolean } from './CorrelationKeyBoolean';
import type { CorrelationKeyMap } from './CorrelationKeyMap';
import type { CorrelationKeyNumber } from './CorrelationKeyNumber';
import type { CorrelationKeyString } from './CorrelationKeyString';
/**
 * Selects which subscription(s) receive a published message.
 *
 * The provided value - primitive (string, number, boolean) or object -
 * is matched against the subscription's resolved correlation value.
 * Matching is type-sensitive (the number `123` does not match the
 * string `"123"`); for objects, the publisher's keys must be a
 * recursive subset of the subscription's stored keys.
 *
 * Empty / omitted broadcasts to subscriptions with no correlation
 * requirement.
 *
 */
export type CorrelationKeys = (CorrelationKeyString | CorrelationKeyNumber | CorrelationKeyBoolean | CorrelationKeyMap);

