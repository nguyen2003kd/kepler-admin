import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability'

export type Subjects = string

/**
 * Actions mở rộng để hỗ trợ fine-grained permissions từ API
 * Bao gồm các CRUD cơ bản và các actions cụ thể theo nghiệp vụ
 */
export type Actions = string

export type AppAbility = Ability<[Actions, Subjects]>

export const AppAbility = Ability as AbilityClass<AppAbility>

export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Parse permissions từ format backend sang CASL format
 * Backend format: ["dashboard:view_summary", "news:update", "news:delete"]
 * CASL format: can('view_summary', 'dashboard'), can('update', 'news')
 */
export const parsePermissions = (permissions: string[]): { action: Actions; subject: string }[] => {
  return permissions
    .filter(permission => permission && permission.includes(':'))
    .map(permission => {
      const colonIndex = permission.indexOf(':')
      const resource = permission.substring(0, colonIndex)
      const action = permission.substring(colonIndex + 1)
      return {
        action,
        subject: resource
      }
    })
}

/**
 * Build CASL ability từ user permissions
 * @param permissions Array of permission strings từ backend (e.g., ["dashboard:view_summary", "news:update"])
 * @param roles Array of role names (để xử lý SuperAdmin)
 */
export const buildAbilityFor = (permissions: string[] = [], roles: string[] = []): AppAbility => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // Super Admin role has full access
  if (roles.includes('SuperAdmin') || roles.includes('super-admin') || roles.includes('Admin')) {
    can('manage', 'all')
    return new AppAbility(rules, {
      detectSubjectType: (subject) => (subject as { type?: string }).type as string
    })
  }

  // Parse and apply permissions from backend
  const parsedPermissions = parsePermissions(permissions)
  parsedPermissions.forEach(({ action, subject }) => {
    can(action, subject)
  })

  return new AppAbility(rules, {
    detectSubjectType: (subject) => (subject as { type?: string }).type as string
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default buildAbilityFor
