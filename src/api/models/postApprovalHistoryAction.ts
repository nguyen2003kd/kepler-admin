/* eslint-disable */

/**
 * Action (APPROVED or REJECTED)
 */
export type PostApprovalHistoryAction = typeof PostApprovalHistoryAction[keyof typeof PostApprovalHistoryAction];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostApprovalHistoryAction = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
