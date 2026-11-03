/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Where a list paged by cursor stands. Pass `nextCursor` back as `cursor`
 * for the next page. It is absent on the last page. `total` counts the
 * matches on the first page only, the one read without a cursor, and stops
 * at 10,000, which `totalCapped` reports.
 *
 */
export type CursorPage = {
    nextCursor?: string;
    total?: number;
    totalCapped?: boolean;
};

