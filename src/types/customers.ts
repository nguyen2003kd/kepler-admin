/**
 * Customers Types
 * Types for customer/user management pages
 */

// =============================================================================
// USER ROW TYPE (from API)
// =============================================================================

export interface UserRow extends Record<string, unknown> {
  id: string
  username: string
  email: string
  first_name: string | null
  last_name: string | null
  status: string
  created_at: string
  [key: string]: unknown
}

// =============================================================================
// USER FORM TYPES (for create/edit modals)
// =============================================================================

export interface UserFormData {
  username: string
  email: string
  firstName: string
  lastName: string
  password?: string
  status: 'active' | 'inactive'
}

// =============================================================================
// USER PAGE STATE
// =============================================================================

export interface UsersPageState {
  search: string
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  selectedUserId: string | null
}

// =============================================================================
// HELPER: Get string value safely from user row
// =============================================================================

export const getUserRowString = (
  row: Record<string, unknown> | undefined,
  key: string
): string => {
  if (!row) return ''
  const value = row[key]
  return typeof value === 'string' ? value : String(value ?? '')
}

// =============================================================================
// HELPER: Get full name from user row
// =============================================================================

export const getUserFullName = (row: UserRow): string => {
  return [row.first_name, row.last_name].filter(Boolean).join(' ')
}
