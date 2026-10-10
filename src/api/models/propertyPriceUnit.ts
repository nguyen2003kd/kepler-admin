/* eslint-disable */

export type PropertyPriceUnit = typeof PropertyPriceUnit[keyof typeof PropertyPriceUnit];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyPriceUnit = {
  VND: 'VND',
  VND_MONTH: 'VND_MONTH',
  VND_M2: 'VND_M2',
  VND_M2_MONTH: 'VND_M2_MONTH',
  USD: 'USD',
  USD_MONTH: 'USD_MONTH',
  USD_M2: 'USD_M2',
  USD_M2_MONTH: 'USD_M2_MONTH',
} as const;
