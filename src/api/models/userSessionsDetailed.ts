/* eslint-disable */
import type { UserSessionsDetailedDeviceInfo } from './userSessionsDetailedDeviceInfo';

export interface UserSessionsDetailed {
  id?: string;
  user_id?: string;
  session_token?: string;
  refresh_token?: string;
  token_version?: number;
  device_info?: UserSessionsDetailedDeviceInfo;
  ip_address?: string;
  user_agent?: string;
  expires_at?: string;
  refresh_expires_at?: string;
  is_active?: boolean;
  created_at?: string;
  last_activity_at?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}
