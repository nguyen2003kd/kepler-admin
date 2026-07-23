/* eslint-disable */

export interface PasswordResetSubmit {
  /** User email address (must have verified OTP first) */
  email: string;
  /**
   * New password (min 8 chars, must contain uppercase, lowercase, number)
   * @minLength 8
   */
  newPassword: string;
  /** Confirm new password */
  confirmPassword: string;
}
