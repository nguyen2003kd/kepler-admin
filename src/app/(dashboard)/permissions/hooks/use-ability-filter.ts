/**
 * Permission hooks cho trang Quản lý phân quyền
 * resource = "role" cho tất cả thao tác liên quan vai trò
 */

'use client';

import { useAbility } from '@/hooks/use-ability';

/**
 * role:create → nút tạo vai trò mới
 */
export function useCanCreateRole(): boolean {
  const ability = useAbility();
  return ability.can('create', 'role') || ability.can('manage', 'all');
}

/**
 * role:update → nút sửa tên/mô tả vai trò
 */
export function useCanUpdateRole(): boolean {
  const ability = useAbility();
  return ability.can('update', 'role') || ability.can('manage', 'all');
}

/**
 * role:update-permission → nút chỉnh sửa quyền
 */
export function useCanUpdateRolePermission(): boolean {
  const ability = useAbility();
  return ability.can('update_permission', 'role') || ability.can('manage', 'all');
}

/**
 * role:add-user → nút thêm người dùng vào vai trò
 */
export function useCanAddUserToRole(): boolean {
  const ability = useAbility();
  return ability.can('add_user', 'role') || ability.can('manage', 'all');
}

/**
 * role:delete → xóa vai trò
 */
export function useCanDeleteRole(): boolean {
  const ability = useAbility();
  return ability.can('delete', 'role') || ability.can('manage', 'all');
}
