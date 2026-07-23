/* eslint-disable */

/**
 * Approval status
 * @nullable
 */
export type PostStatus = typeof PostStatus[keyof typeof PostStatus] | null;


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostStatus = {
  DRAFT: 'DRAFT',
  PENDING_L1: 'PENDING_L1',
  PENDING_L2: 'PENDING_L2',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
} as const;
