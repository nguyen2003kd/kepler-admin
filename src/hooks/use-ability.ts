'use client';

import { useContext } from 'react';
import { AbilityContext } from '@configs/AbilityContext';
import type { AppAbility } from '@configs/acl';

/**
 * Hook để truy cập CASL ability trong components
 * @example
 * const ability = useAbility();
 * if (ability.can('view_summary', 'dashboard')) {
 *   // Show dashboard summary
 * }
 * if (ability.can('update', 'news')) {
 *   // Show edit button
 * }
 */
export const useAbility = (): AppAbility => {
  return useContext(AbilityContext);
};

/**
 * Hook để kiểm tra quyền thực hiện một action
 * @param action - Action name (e.g., 'view_summary', 'update', 'delete')
 * @param subject - Resource name (e.g., 'dashboard', 'news', 'category')
 * @example
 * const canUpdate = useCan('update', 'news');
 * const canViewSummary = useCan('view_summary', 'dashboard');
 */
export const useCan = (action: string, subject: string): boolean => {
  const ability = useAbility();
  return ability.can(action, subject);
};

/**
 * Hook để kiểm tra user KHÔNG có quyền thực hiện action
 * @example
 * const cannotDelete = useCannot('delete', 'news');
 */
export const useCannot = (action: string, subject: string): boolean => {
  const ability = useAbility();
  return ability.cannot(action, subject);
};

/**
 * Hook kiểm tra user có ít nhất 1 permission trong danh sách
 * Dùng với PERMISSIONS constant từ permissions-matrix
 * @example
 * import { PERMISSIONS } from '@configs/permissions-matrix';
 * const canAccessNews = useCanAny([PERMISSIONS.news.view_detail, PERMISSIONS.news.update]);
 */
export const useCanAny = (permissions: string[]): boolean => {
  const ability = useAbility();

  // SuperAdmin check
  if (ability.can('manage', 'all')) return true;

  return permissions.some(permission => {
    const colonIndex = permission.indexOf(':');
    if (colonIndex === -1) return false;
    const action = permission.substring(colonIndex + 1);
    const subject = permission.substring(0, colonIndex);
    return ability.can(action, subject);
  });
};
