/* eslint-disable */

export interface PasswordResetVerify {
  /** User email address */
  email: string;
  /**
   * 6-digit verification code
   * @pattern ^\d{6}$
   */
  code: string;
}
