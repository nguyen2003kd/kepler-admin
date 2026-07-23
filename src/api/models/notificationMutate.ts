/* eslint-disable */

export interface NotificationMutate {
  /**
   * Notification title
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * Notification content
   * @minLength 1
   */
  content: string;
  /**
   * Recipient user IDs
   * @minItems 1
   */
  belongs_to_user_id: string[];
  /**
   * Notification expiration time
   * @nullable
   */
  expired_at?: string | null;
}
