/* eslint-disable */

export interface UserRole {
  /** Unique identifier */
  id?: string;
  /** User ID */
  user_id?: string;
  /** Role ID */
  role_id?: string;
  /** Assignment timestamp */
  assigned_at?: string;
  /**
   * ID of the user who assigned the role
   * @nullable
   */
  assigned_by?: string | null;
  /**
   * Whether this is the user's primary role
   * @nullable
   */
  is_primary?: boolean | null;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
}
