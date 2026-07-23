/* eslint-disable */
import type { Notification } from './notification';

export interface NotificationListData {
  count?: number;
  rows?: Notification[];
  page?: number;
  pageSize?: number;
  /** Total unread notifications of current user */
  unread_count?: number;
  /** True when current user still has unread notifications */
  has_unread?: boolean;
}
