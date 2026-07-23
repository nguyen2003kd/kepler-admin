
import { toast } from 'sonner';
import {
  getApiV10Permission,
  postApiV10Permission,
  putApiV10PermissionId,
  deleteApiV10PermissionId,
} from '@/api/endpoints/permission';
import {
  getApiV10Role,
  postApiV10Role,
  putApiV10RoleId,
  deleteApiV10RoleId,
} from '@/api/endpoints/role';
import {
  getApiV10RolePermission,
  postApiV10RolePermissionRoleIdAssign,
  putApiV10RolePermissionRoleIdAssign,
} from '@/api/endpoints/role-permission';
import {
  getApiV10UserRole,
  postApiV10UserRole,
  deleteApiV10UserRoleId,
  putApiV10UserRoleId,
} from '@/api/endpoints/user-role';
import type { Permission } from '@/api/models/permission';

// Re-export types from generated API models
export type { Permission } from '@/api/models/permission';
export type { Role } from '@/api/models/role';
export type { UserRole } from '@/api/models/userRole';
export type { RolePermission } from '@/api/models/rolePermission';

// =============================================================================
// PERMISSION API HELPERS
// =============================================================================

/**
 * Fetch all permissions with optional filters
 */
export async function fetchPermissions(params?: {
  page?: number;
  pageSize?: number;
  filters?: string;
  sortField?: string;
  sortOrder?: 'asc' |'desc';
}) {
  return getApiV10Permission(params);
}

/**
 * Create a new permission
 */
export async function createPermission(data: {
  name: string;
  description: string;
  resource: string;
  action: string;
}) {
  const result = await postApiV10Permission(data);
  toast.success('Permission created successfully');
  return result;
}

/**
 * Update a permission
 */
export async function updatePermission(id: string, data: {
  name: string;
  description: string;
  resource: string;
  action: string;
}) {
  const result = await putApiV10PermissionId(id, data);
  toast.success('Permission updated successfully');
  return result;
}

/**
 * Delete a permission
 */
export async function deletePermission(id: string) {
  const result = await deleteApiV10PermissionId(id);
  toast.success('Permission deleted successfully');
  return result;
}

// =============================================================================
// ROLE API HELPERS
// =============================================================================

/**
 * Fetch all roles
 */
export async function fetchRoles(params?: {
  page?: number;
  pageSize?: number;
}) {
  return getApiV10Role(params);
}

/**
 * Create a new role
 */
export async function createRole(data: {
  name: string;
  description: string;
}) {
  const result = await postApiV10Role(data);
  toast.success('Role created successfully');
  return result;
}

/**
 * Update an existing role
 */
export async function updateRole(id: string, data: {
  name: string;
  description: string;
}) {
  const result = await putApiV10RoleId(id, data);
  toast.success('Role updated successfully');
  return result;
}

/**
 * Delete a role
 */
export async function deleteRole(id: string) {
  const result = await deleteApiV10RoleId(id);
  toast.success('Role deleted successfully');
  return result;
}

// =============================================================================
// ROLE PERMISSION HELPERS
// =============================================================================

/**
 * Fetch permissions for a specific role
 */
export async function fetchRolePermissions(roleId: string) {
  return getApiV10RolePermission({
    filters: `role_id==${roleId}`,
    pageSize: 1000
  });
}

/**
 * Assign a permission to a role (deprecated - use assignMultiplePermissionsToRole)
 * NOTE: This function may not work as the single assign endpoint is not available
 */
export async function assignPermissionToRole(roleId: string, permissionId: string) {
  // Use batch assign API with single permission
  return assignMultiplePermissionsToRole(roleId, [permissionId]);
}

/**
 * Revoke a permission from a role (deprecated - use replaceRolePermissions)
 * NOTE: This function may not work as the delete endpoint is not available
 */  
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function revokePermissionFromRole(_rolePermissionId: string) {
  throw new Error('Delete role permission endpoint is not available. Use replaceRolePermissions instead.');
}

/**
 * Bulk assign permissions to a role (deprecated - use assignMultiplePermissionsToRole)
 */
export async function bulkAssignPermissionsToRole(
  roleId: string,
  permissionIds: string[]
) {
  const promises = permissionIds.map(permissionId =>
    assignPermissionToRole(roleId, permissionId)
  );

  try {
    await Promise.all(promises);
    toast.success(`${permissionIds.length} permissions assigned successfully`);
  } catch (error) {
    toast.error('Failed to assign some permissions');
    throw error;
  }
}

/**
 * Assign multiple permissions to a role at once using batch API
 * Uses POST /api/v1.0/rolePermission/{role_id}/assign
 */
export async function assignMultiplePermissionsToRole(
  roleId: string,
  permissionIds: string[]
) {
  if (permissionIds.length === 0) {
    return;
  }

  const result = await postApiV10RolePermissionRoleIdAssign(
    roleId,
    { permission_ids: permissionIds }
  );
  toast.success(`Đã gán ${permissionIds.length} quyền cho vai trò`);
  return result;
}

/**
 * Replace all permissions of a role with a new set
 * Uses PUT /api/v1.0/rolePermission/{role_id}/assign
 */
export async function replaceRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  const result = await putApiV10RolePermissionRoleIdAssign(
    roleId,
    { permission_ids: permissionIds }
  );
  toast.success(`Đã cập nhật ${permissionIds.length} quyền cho vai trò`);
  return result;
}

// =============================================================================
// USER ROLE HELPERS
// =============================================================================

/**
 * Fetch roles for a specific user
 */
export async function fetchUserRoles(userId: string) {
  return getApiV10UserRole({
    filters: `user_id@=${userId}`,
    pageSize: 100
  });
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  isPrimary: boolean = false
) {
  const result = await postApiV10UserRole({
    user_id: userId,
    role_id: roleId,
    is_primary: isPrimary
  });
  toast.success('Role assigned to user');
  return result;
}

/**
 * Revoke a role from a user
 */
export async function revokeRoleFromUser(userRoleId: string) {
  const result = await deleteApiV10UserRoleId(userRoleId);
  toast.success('Role revoked from user');
  return result;
}

/**
 * Set a user role as primary
 */
export async function setPrimaryRole(userRoleId: string, userId: string, roleId: string) {
  const result = await putApiV10UserRoleId(userRoleId, {
    user_id: userId,
    role_id: roleId,
    is_primary: true
  });
  toast.success('Primary role updated');
  return result;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Group permissions by resource
 */
export function groupPermissionsByResource(permissions: Permission[]) {
  return permissions.reduce((acc, perm) => {
    const resource = perm.resource || 'unknown';
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);
}

/**
 * Format permission for display
 */
export function formatPermission(permission: Permission): string {
  return `${permission.resource || 'unknown'}:${permission.action || 'unknown'}`;
}

/**
 * Parse permission string
 */
export function parsePermission(permissionString: string): {
  resource: string;
  action: string;
} | null {
  const [resource, action] = permissionString.split(':');
  if (!resource || !action) return null;
  return { resource, action };
}

/**
 * Get all unique resources from permissions
 */
export function getUniqueResources(permissions: Permission[]): string[] {
  return Array.from(new Set(permissions.map(p => p.resource).filter((r): r is string => !!r)));
}

/**
 * Get all unique actions from permissions
 */
export function getUniqueActions(permissions: Permission[]): string[] {
  return Array.from(new Set(permissions.map(p => p.action).filter((a): a is string => !!a)));
}

/**
 * Check if user has specific permission
 */
export function hasPermission(
  userPermissions: string[],
  resource: string,
  action: string
): boolean {
  return userPermissions.includes(`${resource}:${action}`);
}

/**
 * Get user's permissions from roles
 * This aggregates all permissions from all user's roles
 */
export async function getUserPermissionsFromRoles(userId: string): Promise<string[]> {
  try {
    // Fetch user roles
    const userRolesData = await fetchUserRoles(userId);
    const userRoles = (userRolesData.responseData?.rows as unknown[]) || [];

    // Fetch permissions for each role
    const allPermissions: Permission[] = [];

    for (const userRole of userRoles) {
      const ur = userRole as Record<string, unknown>;
      if (!ur.role_id) continue;
      
      const rolePermsData = await fetchRolePermissions(ur.role_id as string);
      const rolePermissions = (rolePermsData.responseData?.rows as unknown[]) || [];

      rolePermissions.forEach((rp) => {
        const r = rp as Record<string, unknown>;
        if (r.permission) {
          allPermissions.push(r.permission as Permission);
        }
      });
    }

    // Remove duplicates and format
    const uniquePermissions = Array.from(
      new Map(allPermissions.map(p => [p.id, p])).values()
    );

    return uniquePermissions.map(p => formatPermission(p));
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}
