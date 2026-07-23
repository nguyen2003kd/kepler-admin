/* eslint-disable */
import type { PostApiV10AuthRefreshBodyDeviceInfo } from './postApiV10AuthRefreshBodyDeviceInfo';

export type PostApiV10AuthRefreshBody = {
  /** Refresh token (optional if sent via cookie) */
  refresh_token?: string;
  /** Device information */
  device_info?: PostApiV10AuthRefreshBodyDeviceInfo;
};
