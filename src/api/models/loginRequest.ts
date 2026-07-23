/* eslint-disable */
import type { LoginRequestDeviceInfo } from './loginRequestDeviceInfo';

export interface LoginRequest {
  email: string;
  password: string;
  /** Device information for session tracking */
  device_info?: LoginRequestDeviceInfo;
  /** IP address for security logging */
  ip_address?: string;
  /** User agent string */
  user_agent?: string;
}
