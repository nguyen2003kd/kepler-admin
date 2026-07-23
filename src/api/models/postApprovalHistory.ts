/* eslint-disable */
import type { PostApprovalHistoryAction } from './postApprovalHistoryAction';

export interface PostApprovalHistory {
  /** Unique identifier */
  id?: string;
  /** Post ID */
  post_id?: string;
  /**
   * User ID
   * @nullable
   */
  user_id?: string | null;
  /** Approval level (1 or 2) */
  approval_level?: number;
  /** Action (APPROVED or REJECTED) */
  action?: PostApprovalHistoryAction;
  /**
   * Optional note
   * @nullable
   */
  note?: string | null;
  /** Creation timestamp */
  created_at?: string;
}
