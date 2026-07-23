/* eslint-disable */

export interface Permission {
  /** Unique identifier of the permission */
  id?: string;
  /** Name of the permission */
  name?: string;
  /**
   * Description of what this permission allows
   * @nullable
   */
  description?: string | null;
  /** Resource that this permission applies to */
  resource?: string;
  /** Action that this permission allows on the resource */
  action?: string;
  /**
   * Creation timestamp
   * @nullable
   */
  created_at?: string | null;
  /**
   * ID of the user who created this permission
   * @nullable
   */
  created_by?: string | null;
  /**
   * ID of the user who last updated this permission
   * @nullable
   */
  updated_by?: string | null;
}
