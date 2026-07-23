/* eslint-disable */

export interface Question {
  /** Unique identifier */
  id?: string;
  /** User name */
  name?: string;
  /** User phone number */
  phone_number?: string;
  /** User email */
  email?: string;
  /** User address */
  address?: string;
  /**
   * User major
   * @nullable
   */
  major?: string | null;
  /** Question content */
  question?: string;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
}
