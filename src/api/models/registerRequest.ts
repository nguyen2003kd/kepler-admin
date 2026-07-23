/* eslint-disable */

export interface RegisterRequest {
  email: string;
  /** @minLength 6 */
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}
