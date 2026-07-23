/* eslint-disable */

export interface UserDepartment {
  /** Unique identifier */
  id?: string;
  /** User ID */
  user_id?: string;
  /** Department ID */
  department_id?: string;
  /** Assignment timestamp */
  created_at?: string;
  /**
   * ID of the user who created the assignment
   * @nullable
   */
  created_by?: string | null;
}
