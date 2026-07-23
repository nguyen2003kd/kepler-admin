/* eslint-disable */

export interface PasswordResetCode {
  id?: string;
  user_id?: string;
  code?: string;
  expires_at?: string;
  is_used?: boolean;
  created_at?: string;
}
