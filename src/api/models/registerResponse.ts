/* eslint-disable */

export interface RegisterResponse {
  /** User ID */
  id: string;
  email: string;
  /** @nullable */
  username?: string | null;
  /** @nullable */
  first_name?: string | null;
  /** @nullable */
  last_name?: string | null;
  /** @nullable */
  phone?: string | null;
  status: string;
  created_at: string;
  /** @nullable */
  updated_at?: string | null;
}
