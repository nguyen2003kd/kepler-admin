/**
 * Custom hooks for permissions UI
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchRoles,
  fetchPermissions,
  fetchRolePermissions,
  createRole as apiCreateRole,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
  assignMultiplePermissionsToRole,
  replaceRolePermissions,
  assignRoleToUser,
  type Role as BackendRole,
  type Permission as BackendPermission,
} from '@/lib/permission-utils';
import {
  rolePermissionsToModulePermissions,
  modulePermissionsToBackendPermissionIds,
  MODULE_DEFINITIONS,
} from '../lib/permission-adapter';
import type { Role } from '../types';

/**
 * Invalidate all permissions-related query cache.
 * Called after any mutation succeeds.
 */
function invalidateAllPermissions(queryClient: ReturnType<typeof useQueryClient>, roleId?: string) {
  queryClient.invalidateQueries({ queryKey: ['permissions-ui', 'roles'] });
  queryClient.invalidateQueries({ queryKey: ['permissions-ui', 'backend-permissions'] });
  if (roleId) {
    queryClient.invalidateQueries({ queryKey: ['permissions-ui', 'role-permissions', roleId] });
  }
}

/**
 * Fetch all roles (without permissions — permissions loaded lazily per role)
 */
export function useRoles() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['permissions-ui', 'roles'],
    queryFn: async () => {
      const response = await fetchRoles({ pageSize: 100 });
      const roles = (response.responseData?.rows as unknown[]) || [];
      return roles.map((r): Role => {
        const role = r as BackendRole;
        return {
          id: role.id || '',
          name: role.name || '',
          description: role.description || '',
          permissions: [],
          isSystem: false,
          ...(role.created_at ? { createdAt: role.created_at } : {}),
        };
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    roles: data || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Fetch permissions for a specific role — only called when opening the edit dialog.
 * Caches result so reopening the same role is instant.
 */
export function useRolePermissions(roleId: string | null) {
  const { data: allBackendPermissions } = useBackendPermissions();

  return useQuery({
    queryKey: ['permissions-ui', 'role-permissions', roleId],
    queryFn: async () => {
      if (!roleId || !allBackendPermissions) return null;

      const rolePermsResponse = await fetchRolePermissions(roleId);
      const rolePermissions = (rolePermsResponse.responseData?.rows as unknown[]) || [];

      return rolePermissionsToModulePermissions(
        rolePermissions,
        MODULE_DEFINITIONS,
        allBackendPermissions
      );
    },
    enabled: !!roleId && !!allBackendPermissions,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch all backend permissions
 */
export function useBackendPermissions() {
  return useQuery({
    queryKey: ['permissions-ui', 'backend-permissions'],
    queryFn: async () => {
      const response = await fetchPermissions({ pageSize: 1000 });
      return (response.responseData?.rows as BackendPermission[]) || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Update role info only (name + description) — calls PUT /api/v1.0/role
 */
export function useUpdateRoleInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      await apiUpdateRole(id, { name, description });
    },
    onSuccess: () => {
      invalidateAllPermissions(queryClient);
      toast.success('Thông tin vai trò đã được cập nhật');
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error('Có lỗi xảy ra khi cập nhật vai trò');
    },
  });
}

/**
 * Create or update a role (full — name + description + permissions)
 */
export function useSaveRole() {
  const queryClient = useQueryClient();
  const { data: allBackendPermissions } = useBackendPermissions();

  return useMutation({
    mutationFn: async (role: Role) => {
      // Step 1: Create/update role
      let roleId: string;
      const isNewRole = role.id.startsWith('role-');
      
      if (isNewRole) {
        // New role - create role first
        const response = await apiCreateRole({
          name: role.name,
          description: role.description,
        });
        roleId = response.responseData?.id || '';
        if (!roleId) throw new Error('Failed to create role');
      } else {
        // Existing role
        roleId = role.id;
      }

      // Step 2: Find matching backend permission IDs
      if (allBackendPermissions) {
        const permissionIds = modulePermissionsToBackendPermissionIds(
          role.permissions,
          allBackendPermissions
        );

        if (isNewRole) {
          // For new role, use batch assign API
          if (permissionIds.length > 0) {
            await assignMultiplePermissionsToRole(roleId, permissionIds);
          }
        } else {
          // For existing role, replace all permissions at once
          await replaceRolePermissions(roleId, permissionIds);
        }
      }

      return roleId;
    },
    onSuccess: (_data, role) => {
      invalidateAllPermissions(queryClient, role.id);
      toast.success('Vai trò đã được lưu thành công');
    },
    onError: (error) => {
      console.error('Error saving role:', error);
      toast.error('Có lỗi xảy ra khi lưu vai trò');
    },
  });
}

/**
 * Delete a role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      await apiDeleteRole(roleId);
    },
    onSuccess: () => {
      invalidateAllPermissions(queryClient);
      toast.success('Vai trò đã được xóa');
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
      toast.error('Có lỗi xảy ra khi xóa vai trò');
    },
  });
}

/**
 * Fetch users with their roles
 */
export function useUsersWithRoles() {
  return useQuery({
    queryKey: ['permissions-ui', 'users-with-roles'],
    queryFn: async () => {
      // TODO: Implement when user endpoint is available
      // For now return empty array
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Assign role to user
 */
export function useAssignRoleToUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      await assignRoleToUser(userId, roleId, false);
    },
    onSuccess: (_data, { roleId }) => {
      invalidateAllPermissions(queryClient, roleId);
      toast.success('Đã gán vai trò cho người dùng');
    },
    onError: (error) => {
      console.error('Error assigning role:', error);
      toast.error('Có lỗi xảy ra khi gán vai trò');
    },
  });
}
