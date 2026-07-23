/* eslint-disable */
import type { PostApprovalResultStatus } from './postApprovalResultStatus';

export interface PostApprovalResult {
  /** Approval result status */
  status: PostApprovalResultStatus;
  /**
   * Approval note
   * @nullable
   */
  note?: string | null;
}
