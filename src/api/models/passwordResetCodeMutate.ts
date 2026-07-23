/* eslint-disable */

export interface PasswordResetCodeMutate {
  user_id?: string;
  code?: string;
  expires_at?: string;
  is_used?: boolean;
}
