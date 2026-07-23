'use client'

import { useAbility } from '@/hooks/use-ability'

const RESOURCE = 'work-schedule'

/**
 * work-schedule:view → được xem trang
 */
export function useCanViewWorkSchedule(): boolean {
  const ability = useAbility()
  return ability.can('view', RESOURCE) || ability.can('manage', 'all')
}

/**
 * work-schedule:create-collaborate → nút thêm sự kiện
 */
export function useCanCreateWorkSchedule(): boolean {
  const ability = useAbility()
  return ability.can('create_collaborate', RESOURCE) || ability.can('manage', 'all')
}

/**
 * work-schedule:edit-collaborate → nút sửa sự kiện
 */
export function useCanEditWorkSchedule(): boolean {
  const ability = useAbility()
  return ability.can('edit_collaborate', RESOURCE) || ability.can('manage', 'all')
}

/**
 * work-schedule:create-participants → nút thêm người tham gia sự kiện
 */
export function useCanManageWorkScheduleParticipants(): boolean {
  const ability = useAbility()
  return ability.can('create_participants', RESOURCE) || ability.can('manage', 'all')
}

/**
 * work-schedule:delete-collaborate → nút xóa sự kiện
 */
export function useCanDeleteWorkSchedule(): boolean {
  const ability = useAbility()
  return ability.can('delete_collaborate', RESOURCE) || ability.can('manage', 'all')
}
