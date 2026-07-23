/* eslint-disable */

export interface LoginResponse {
  /** JWT access token */
  access_token: string;
  /** JWT refresh token */
  refresh_token: string;
  /** Access token expiration time in seconds */
  expires_in: number;
  /** Refresh token expiration time in seconds */
  refresh_expires_in: number;
  token_type: string;
}
