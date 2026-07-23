/* eslint-disable */

export interface Notification {
  /** Notification ID */
  id?: string;
  /** Notification title */
  title?: string;
  /** Notification content */
  content?: string;
  /** Recipient user ID */
  belongs_to_user_id?: string;
  /** Whether user has read notification */
  has_user_read?: boolean;
  /**
   * Time when push notification was sent
   * @nullable
   */
  sent_time?: string | null;
  /** Whether push notification was sent to OneSignal */
  has_noti_sent?: boolean;
  /**
   * Notification expiration time
   * @nullable
   */
  expired_at?: string | null;
  /** Creation timestamp */
  created_at?: string;
  /**
   * Last update timestamp
   * @nullable
   */
  updated_at?: string | null;
}
