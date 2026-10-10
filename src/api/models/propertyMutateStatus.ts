/* eslint-disable */

export type PropertyMutateStatus = typeof PropertyMutateStatus[keyof typeof PropertyMutateStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyMutateStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
