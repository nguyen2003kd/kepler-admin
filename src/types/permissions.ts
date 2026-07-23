/**
 * Permission System Type Definitions
 * Centralized type definitions for the permission system
 */

// =============================================================================
// PERMISSION TYPES
// =============================================================================

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface PermissionMutate {
  name: string;
  description: string;
  resource: string;
  action: string;
}

// =============================================================================
// ROLE TYPES
// =============================================================================

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface RoleMutate {
  name: string;
  description: string;
}

// =============================================================================
// USER ROLE TYPES
// =============================================================================

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by?: string;
  is_primary: boolean;
  updated_at?: string;
  // Populated fields
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  role?: Role;
  assigned_by_user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface UserRoleMutate {
  user_id: string;
  role_id: string;
  is_primary?: boolean;
}

// =============================================================================
// ROLE PERMISSION TYPES
// =============================================================================

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
  // Populated fields
  role?: Role;
  permission?: Permission;
}

export interface RolePermissionMutate {
  role_id: string;
  permission_id: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  responseCode: number;
  responseMessage: {
    vi: string;
    en: string;
  };
  responseData: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  responseCode: number;
  responseMessage: {
    vi: string;
    en: string;
  };
  error?: string;
}

// =============================================================================
// CASL ABILITY TYPES
// =============================================================================

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'list';

export type Subjects = string;

export interface ACLObj {
  action: Actions;
  subject: string;
}

// =============================================================================
// QUERY PARAMS TYPES
// =============================================================================

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: string;
}

// =============================================================================
// FILTER OPERATORS
// =============================================================================

export type FilterOperator = '@=' | '@!=' | '@>' | '@>=' | '@<' | '@<=';

export interface FilterBuilder {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

// =============================================================================
// HELPER FUNCTIONS FOR TYPE GUARDS
// =============================================================================

export function isPermission(obj: unknown): obj is Permission {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'resource' in obj &&
    'action' in obj
  );
}

export function isRole(obj: unknown): obj is Role {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'description' in obj
  );
}

export function isUserRole(obj: unknown): obj is UserRole {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'user_id' in obj &&
    'role_id' in obj &&
    'is_primary' in obj
  );
}

// =============================================================================
// PERMISSION FORMAT HELPERS
// =============================================================================

/**
 * Standard permission format: "resource:action"
 * Examples: "user:create", "post:delete", "comment:update"
 */
export type PermissionString = `${string}:${string}`;

export function formatPermissionString(resource: string, action: string): PermissionString {
  return `${resource}:${action}`;
}

export function parsePermissionString(permissionString: PermissionString): {
  resource: string;
  action: string;
} | null {
  const [resource, action] = permissionString.split(':');
  if (!resource || !action) return null;
  return { resource, action };
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const COMMON_RESOURCES = [
  'user',
  'role',
  'permission',
  'post',
  'category',
  'comment',
  'page',
  'file',
  'analytics'
] as const;

export const COMMON_ACTIONS: Actions[] = [
  'create',
  'read',
  'update',
  'delete',
  'list',
  'manage'
] as const;

export type CommonResource = typeof COMMON_RESOURCES[number];
