/* eslint-disable */

export type SortOrderParameter = typeof SortOrderParameter[keyof typeof SortOrderParameter];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SortOrderParameter = {
  asc: 'asc',
  desc: 'desc',
} as const;
