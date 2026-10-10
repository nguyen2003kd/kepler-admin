/* eslint-disable */
import type { PropertyInquiryKind } from './propertyInquiryKind';

export interface PropertyInquiry {
  /** @maxLength 255 */
  name: string;
  /**
   * @minLength 8
   * @maxLength 20
   */
  phone_number: string;
  /** @maxLength 5000 */
  content?: string;
  kind: PropertyInquiryKind;
}
