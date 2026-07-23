/* eslint-disable */

/**
 * Approval status
 * @nullable
 */
export type PostMutateStatus = typeof PostMutateStatus[keyof typeof PostMutateStatus] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMutateStatus = {
  DRAFT: 'DRAFT',
  PENDING_L1: 'PENDING_L1',
  PENDING_L2: 'PENDING_L2',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
} as const;
