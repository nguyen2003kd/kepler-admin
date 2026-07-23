/* eslint-disable */

export interface Role {
  /** Unique identifier of the role */
  id?: string;
  /** Name of the role */
  name?: string;
  /**
   * Description of the role
   * @nullable
   */
  description?: string | null;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
  /**
   * ID of the user who created this role
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated this role
   * @nullable
   */
  updated_by?: string | null;
}
