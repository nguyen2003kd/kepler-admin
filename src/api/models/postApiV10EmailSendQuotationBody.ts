/* eslint-disable */
import type { PostApiV10EmailSendQuotationBodyEmailType } from './postApiV10EmailSendQuotationBodyEmailType';
import type { PostApiV10EmailSendQuotationBodyFilesItem } from './postApiV10EmailSendQuotationBodyFilesItem';

export type PostApiV10EmailSendQuotationBody = {
  /** Type of email to send */
  emailType: PostApiV10EmailSendQuotationBodyEmailType;
  /** Quotation code */
  quotationCode: string;
  /** Customer name */
  name?: string;
  /** Organization name */
  organizationName?: string;
  /** Phone number */
  phoneNumber?: string;
  /** Customer email address */
  email: string;
  /** Quotation description */
  description?: string;
  /** Status name */
  statusName?: string;
  /** Receive Method */
  receiveMethod?: string;
  /** Response time (for update email) */
  responseTime?: string;
  /** Price (for update email) */
  price?: string;
  /** Array of file objects with name and path */
  files?: PostApiV10EmailSendQuotationBodyFilesItem[];
};
