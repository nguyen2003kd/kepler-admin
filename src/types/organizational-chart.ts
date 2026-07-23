/**
 * Organizational Chart Types
 * Flat coordinate-based layout (no parent/child hierarchy)
 */

// =============================================================================
// NODE SIZE
// =============================================================================

export interface NodeSize {
  width: number
  height: number
}

// =============================================================================
// NODE COORDINATES
// =============================================================================

export interface NodeCoordinates {
  x: number
  y: number
}

// =============================================================================
// API NODE TYPE (raw API response — flat array)
// =============================================================================

export interface ApiOrgNode {
  id?: string
  department_id?: string | null
  department_name?: string | null
  full_name?: string
  position?: string | null
  avatar_url?: string | null
  description?: string | null
  color?: string | null
  size?: NodeSize | null
  coordinates?: NodeCoordinates | null
  message?: string | null
  message_en?: string | null
}

// =============================================================================
// NORMALIZED ORG NODE TYPE
// =============================================================================

export interface OrgNode {
  id: string
  department_id: string
  department_name: string
  full_name: string
  position: string
  avatar_url?: string | null
  description?: string | null
  color?: string | null
  size?: NodeSize | null
  coordinates: NodeCoordinates
}

// =============================================================================
// ADD NODE TYPES
// =============================================================================

export type AddActionType = 'new'

export interface AddNodeData {
  full_name: string
  position: string
  department_id: string
  description?: string | null
  avatar_url?: string | null
  color?: string | null
  size?: NodeSize | null
  coordinates?: NodeCoordinates | null
}

export interface DepartmentOption {
  id: string
  name: string
}

// =============================================================================
// HELPER: Map API response to normalized OrgNode
// =============================================================================

export const mapApiNodeToOrgNode = (node: ApiOrgNode): OrgNode => {
  return {
    id: node.id || crypto.randomUUID(),
    department_id: node.department_id || '',
    department_name: node.department_name || 'Chưa xác định',
    full_name: node.full_name || 'Chưa cập nhật',
    position: node.position || 'Chưa cập nhật',
    avatar_url: node.avatar_url || null,
    description: node.description || null,
    color: node.color || null,
    size: node.size || null,
    coordinates: node.coordinates || { x: 0, y: 0 },
  }
}
