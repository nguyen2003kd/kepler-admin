/* eslint-disable */

export type PropertyStatus = typeof PropertyStatus[keyof typeof PropertyStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
