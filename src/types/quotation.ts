/**
 * Quotation System Types
 * Types for quotation management and pricing requests
 */

// =============================================================================
// TAB TYPES
// =============================================================================

export type QuotationTabType = 'all' | 'admin' | 'customer'

// =============================================================================
// QUOTATION RESPONSE TYPES
// =============================================================================

export interface QuotationRow extends Record<string, unknown> {
  id: string
  created_at: string
  receive_method?: {
    name?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface QuotationPageResponse {
  responseData?: {
    rows?: QuotationRow[]
    count?: number
    page?: number
    pageSize?: number
  }
}

// =============================================================================
// QUOTATION STATUS COUNTS
// =============================================================================

export interface QuotationStatusCounts {
  new: number
  processing: number
  responded: number
  completed: number
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export interface QuotationFilters extends Record<string, unknown> {
  search?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  is_admin?: boolean
}

// =============================================================================
// STATUS LABEL MAP
// =============================================================================

export const QUOTATION_STATUS_LABELS: Record<string, string> = {
  'mới tạo': 'Mới tạo',
  new: 'Mới tạo',
  processing: 'Đang xử lý',
  responded: 'Đã phản hồi',
  completed: 'Hoàn thành',
}
