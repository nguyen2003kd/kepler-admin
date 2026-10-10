/* eslint-disable */

export type PropertyInquiryKind = typeof PropertyInquiryKind[keyof typeof PropertyInquiryKind];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PropertyInquiryKind = {
  ORDER: 'ORDER',
  MESSAGE: 'MESSAGE',
} as const;
