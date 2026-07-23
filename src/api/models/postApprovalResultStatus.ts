/* eslint-disable */

/**
 * Approval result status
 */
export type PostApprovalResultStatus = typeof PostApprovalResultStatus[keyof typeof PostApprovalResultStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApprovalResultStatus = {
  PENDING_L2: 'PENDING_L2',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
} as const;
