/* eslint-disable */

export interface Quotation {
  /** Unique identifier */
  id?: string;
  /** Customer name */
  name?: string;
  /** ID of the related post */
  post_id?: string;
  /** Customer phone number */
  phone_number?: string;
  /** Customer email address */
  email?: string;
  /**
   * Additional description or notes
   * @nullable
   */
  description?: string | null;
  /** Quoted price */
  price?: string;
  /**
   * Organization or company name
   * @nullable
   */
  organization_name?: string | null;
  /**
   * ID of the receive method
   * @nullable
   */
  receive_method_id?: string | null;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created the record
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated the record
   * @nullable
   */
  updated_by?: string | null;
}
