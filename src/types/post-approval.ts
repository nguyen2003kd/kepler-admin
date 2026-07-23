/**
 * Post Approval System Types
 * Shared types for L1 and L2 post approval workflows
 */

import type { PostStatus as PostStatusType } from '@/api/models'

// =============================================================================
// APPROVAL ITEM TYPES
// =============================================================================

export interface ApprovalPost {
  id: string
  title: string
  code: string
  status: PostStatusType | null
  created_at: string
}

export interface ApprovalHistoryItem {
  id: string
  approval_level: number
  action: string
  note: string | null
  created_at: string
}

// =============================================================================
// TAB & FILTER TYPES
// =============================================================================

export type ApprovalTabKey = 'pending' | 'approved' | 'rejected'

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApprovalPageResponse {
  page: number
  pageSize: number
  count: number
  rows: ApprovalPost[]
}

// =============================================================================
// L1 APPROVAL STATUS MAP
// =============================================================================

export const L1_STATUS_MAP: Record<ApprovalTabKey, string> = {
  pending: 'PENDING_L1',
  approved: 'PENDING_L2',
  rejected: 'REJECTED',
}

// =============================================================================
// L2 APPROVAL STATUS MAP
// =============================================================================

export const L2_STATUS_MAP: Record<ApprovalTabKey, string> = {
  pending: 'PENDING_L2',
  approved: 'PUBLISHED',
  rejected: 'REJECTED',
}

// =============================================================================
// HELPER: Format date time
// =============================================================================

export const formatApprovalDateTime = (value?: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('vi-VN')
}
