/* eslint-disable */

/**
 * Nhóm giao dịch
 * @nullable
 */
export type PropertyMutateTransactionGroup = typeof PropertyMutateTransactionGroup[keyof typeof PropertyMutateTransactionGroup] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyMutateTransactionGroup = {
  SALE: 'SALE',
  RENT: 'RENT',
  DISTRIBUTION: 'DISTRIBUTION',
  INVESTMENT: 'INVESTMENT',
  MA: 'MA',
} as const;
