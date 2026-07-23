'use client';

import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@stores/auth';

/**
 * Hook to fetch and sync user permissions
 * This should be called in the root layout or after login
 */
export const useUserPermissions = () => {
  const { email, setStore } = useAuthStore();

  // Fetch user roles and permissions
  const { data: userRolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['userRoles', email],
    queryFn: async () => {
      // This would fetch from GET /api/v1.0/userRole?filters=user_id@={userId}
      // For now, assuming you have a current user endpoint that returns roles and permissions
      const response = await fetch('/api/v1.0/user/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.json();
    },
    enabled: !!email,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Sync permissions to auth store
  useEffect(() => {
    if (userRolesData?.responseData) {
      const userData = userRolesData.responseData;
      
      // Extract roles and permissions
      const roles = userData.roles || [];
      const permissions = userData.permissions || [];

      setStore({ 
        roles,
        permissions 
      });
    }
  }, [userRolesData, setStore]);

  return {
    roles: useAuthStore(state => state.roles) || [],
    permissions: useAuthStore(state => state.permissions) || [],
    isLoading: rolesLoading
  };
};

/**
 * Hook to manually fetch user's full permission details
 * Fetches: User -> UserRoles -> Roles -> RolePermissions -> Permissions
 */
export const useUserPermissionDetails = (userId?: string) => {
  const fetchPermissionDetails = useCallback(async (uid: string) => {
    try {
      // Step 1: Fetch user roles
      const userRolesResponse = await fetch(
        `/api/v1.0/userRole?filters=user_id@=${uid}&pageSize=100`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const userRolesData = await userRolesResponse.json();
      const userRoles = userRolesData.responseData?.rows || [];

      // Step 2: Fetch permissions for each role
      const allPermissions: unknown[] = [];
      const roleDetails: unknown[] = [];

      for (const userRole of userRoles) {
        const roleId = userRole.role_id;
        
        // Get role details
        roleDetails.push(userRole.role);

        // Fetch role permissions
        const rolePermsResponse = await fetch(
          `/api/v1.0/rolePermission?filters=role_id@=${roleId}&pageSize=100`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const rolePermsData = await rolePermsResponse.json();
        const rolePermissions = rolePermsData.responseData?.rows || [];

        // Collect permissions
        rolePermissions.forEach((rp: { permission?: { id: string; resource: string; action: string } }) => {
          if (rp.permission) {
            allPermissions.push(rp.permission);
          }
        });
      }

      // Remove duplicates
      const uniquePermissions = Array.from(
        new Map(
          allPermissions.map((p) => {
            const perm = p as { id: string; resource: string; action: string };
            return [perm.id, perm];
          })
        ).values()
      );

      // Format permissions as "resource:action"
      const formattedPermissions = uniquePermissions.map((p) => {
        const perm = p as { resource: string; action: string };
        return `${perm.resource}:${perm.action}`;
      });

      return {
        roles: roleDetails,
        permissions: uniquePermissions,
        formattedPermissions
      };
    } catch (error) {
      console.error('Error fetching permission details:', error);
      return {
        roles: [],
        permissions: [],
        formattedPermissions: []
      };
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userPermissionDetails', userId],
    queryFn: () => userId ? fetchPermissionDetails(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    permissionDetails: data || { roles: [], permissions: [], formattedPermissions: [] },
    isLoading,
    error,
    refetch
  };
};
