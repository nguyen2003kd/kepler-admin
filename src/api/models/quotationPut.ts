/* eslint-disable */

export interface QuotationPut {
  /**
   * Customer name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /** ID of the related post */
  post_id?: string;
  /**
   * Customer phone number
   * @minLength 1
   * @maxLength 20
   */
  phone_number?: string;
  /** Customer email address */
  email?: string;
  /**
   * Quoted price
   * @minLength 1
   */
  price?: string;
  /**
   * Additional description or notes
   * @nullable
   */
  description?: string | null;
  /**
   * Organization or company name
   * @maxLength 255
   * @nullable
   */
  organization_name?: string | null;
  /**
   * ID of the quotation status
   * @nullable
   */
  quotation_status_id?: string | null;
  /**
   * Expected response time
   * @nullable
   */
  response_time?: string | null;
  /**
   * ID of the related service
   * @nullable
   */
  service_id?: string | null;
}
