/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeelBoolean } from './FeelBoolean';
import type { FeelContext } from './FeelContext';
import type { FeelList } from './FeelList';
import type { FeelNumber } from './FeelNumber';
import type { FeelString } from './FeelString';
/**
 * A FEEL-typed value as it appears in DMN inputs and outputs. May be a number, string, boolean, list, or nested context.
 */
export type FeelValue = (FeelNumber | FeelString | FeelBoolean | FeelList | FeelContext) | null;

