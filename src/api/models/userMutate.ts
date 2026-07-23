/* eslint-disable */

export interface UserMutate {
  email?: string;
  username?: string;
  /** @minLength 6 */
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  status?: string;
  deleted_at?: string;
}
