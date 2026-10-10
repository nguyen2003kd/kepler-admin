/* eslint-disable */

/**
 * Nhóm giao dịch
 * @nullable
 */
export type PropertyTransactionGroup = typeof PropertyTransactionGroup[keyof typeof PropertyTransactionGroup] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyTransactionGroup = {
  SALE: 'SALE',
  RENT: 'RENT',
  DISTRIBUTION: 'DISTRIBUTION',
  INVESTMENT: 'INVESTMENT',
  MA: 'MA',
} as const;
