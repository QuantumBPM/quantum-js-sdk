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
 * must equal the subscription's resolved correlation value. Matching is
 * type-sensitive: the number `123` does not match the string `"123"`.
 * Numbers compare by value, so `1` matches `1.0`. Objects match when
 * they hold the same keys with equal values, in any key order. Lists
 * match element by element, in order.
 *
 * Omitted, the publish only triggers message start events, since every
 * waiting catch declares a correlation value.
 *
 */
export type CorrelationKeys = (CorrelationKeyString | CorrelationKeyNumber | CorrelationKeyBoolean | CorrelationKeyMap);

