/* eslint-disable */

export interface UserRoleMutate {
  /** User ID */
  user_id: string;
  /** Role ID */
  role_id: string;
  /** Whether this is the user's primary role */
  is_primary?: boolean;
}
