/* eslint-disable */
import type { UserSessionsDetailedMutateDeviceInfo } from './userSessionsDetailedMutateDeviceInfo';

export interface UserSessionsDetailedMutate {
  user_id?: string;
  session_token?: string;
  refresh_token?: string;
  token_version?: number;
  device_info?: UserSessionsDetailedMutateDeviceInfo;
  ip_address?: string;
  user_agent?: string;
  expires_at?: string;
  refresh_expires_at?: string;
  is_active?: boolean;
  last_activity_at?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}
