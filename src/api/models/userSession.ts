/* eslint-disable */
import type { UserSessionDeviceInfo } from './userSessionDeviceInfo';

export interface UserSession {
  id?: string;
  user_id?: string;
  session_token?: string;
  refresh_token?: string;
  token_version?: number;
  device_info?: UserSessionDeviceInfo;
  ip_address?: string;
  user_agent?: string;
  expires_at?: string;
  refresh_expires_at?: string;
  is_active?: boolean;
  created_at?: string;
  last_activity_at?: string;
}
