/* eslint-disable */

/**
 * Type of email to send
 */
export type PostApiV10EmailSendQuotationBodyEmailType = typeof PostApiV10EmailSendQuotationBodyEmailType[keyof typeof PostApiV10EmailSendQuotationBodyEmailType];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApiV10EmailSendQuotationBodyEmailType = {
  quota: 'quota',
  update: 'update',
} as const;
