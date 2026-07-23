/* eslint-disable */
import type { UserAuthPasswordHistory } from './userAuthPasswordHistory';

export interface UserAuth {
  id?: string;
  user_id?: string;
  password_hash?: string;
  last_login_at?: string;
  password_changed_at?: string;
  login_attempts?: number;
  locked_until?: string;
  twofa_secret?: string;
  twofa_backup_codes?: string;
  twofa_enabled?: boolean;
  twofa_method?: string;
  password_history?: UserAuthPasswordHistory;
  created_at?: string;
  updated_at?: string;
}
