/**
 * Permission matrix cho routing/sidebar.
 * Quyen thuc te duoc lay dong tu API profile (permissions trong auth store).
 * File nay chi giu mapping route -> resource(s) cua UI.
 */

import { APP_ROUTES, type AppRouteAccessRule } from './app-routes'

export type RouteAccessRule = AppRouteAccessRule

// ─── Route Access Rules ────────────────────────────────────────────────────
export const ROUTE_ACCESS: Record<string, RouteAccessRule> = {
  ...APP_ROUTES.reduce<Record<string, RouteAccessRule>>((acc, route) => {
    acc[route.path] = route.access
    return acc
  }, {}),
}

// ─── Permission Parsing ──────────────────────────────────────────────────────
type ParsedPermission = { resource: string; action: string }

const parsePermission = (permission: string): ParsedPermission | null => {
  const colonIndex = permission.indexOf(':')
  if (colonIndex === -1) return null
  const resource = permission.substring(0, colonIndex)
  const action = permission.substring(colonIndex + 1)
  if (!resource || !action) return null
  return { resource, action }
}

// ─── Route Matching ──────────────────────────────────────────────────────────
/**
 * So sanh URL voi route pattern bang segments.
 * Ví dụ: "/news/abc" vs "/news/[id]"
 *   → ['', 'news', 'abc'] vs ['', 'news', '[id]'] → match
 */
export const routeMatches = (pathname: string, pattern: string): boolean => {
  const pathSegs = pathname.split('/')
  const patSegs = pattern.split('/')
  if (pathSegs.length !== patSegs.length) return false
  return patSegs.every((seg, i) => {
    if (seg.startsWith('[') && seg.endsWith(']')) return !!pathSegs[i]
    return pathSegs[i] === seg
  })
}

/**
 * Tim route dai nhat match voi pathname (order-independent).
 * Priority: exact match > dynamic match > parent match.
 */
export const findMatchedRoute = (pathname: string): string | null => {
  let bestMatch: string | null = null
  let bestLength = 0

  for (const route of Object.keys(ROUTE_ACCESS)) {
    if (routeMatches(pathname, route) && route.length > bestLength) {
      bestMatch = route
      bestLength = route.length
    }
  }

  return bestMatch
}

// ─── Permission Checking ──────────────────────────────────────────────────────
/**
 * Kiem tra user co it nhat 1 permission trong danh sach.
 */
export const hasAnyPermission = (
  userPermissions: string[],
  requiredPermissions: string[]
): boolean => requiredPermissions.some(p => userPermissions.includes(p))

/**
 * Kiem tra user co quyen voi it nhat 1 resource.
 * Neu co requiredActions thi phai khop ca resource + action.
 */
export const hasAnyResourcePermission = (
  userPermissions: string[],
  resources: string[],
  requiredActions?: string[]
): boolean => {
  const resourceSet = new Set(resources)
  const hasActions = !!(requiredActions && requiredActions.length > 0)
  const actionSet = new Set(requiredActions || [])

  return userPermissions.some(permission => {
    const parsed = parsePermission(permission)
    if (!parsed) return false
    if (!resourceSet.has(parsed.resource)) return false
    if (!hasActions) return true
    return actionSet.has(parsed.action)
  })
}

/**
 * Kiem tra quyen truy cap route theo rule (chinh).
 */
export const hasRouteAccess = (
  userPermissions: string[],
  routeRule: RouteAccessRule
): boolean => hasAnyResourcePermission(
  userPermissions,
  routeRule.resources,
  routeRule.requiredActions
)

/**
 * Lay extraViewerResources + extraViewerActions tu tat ca dynamic routes
 * match voi pathname.
 */
export const getExtraViewerForPath = (pathname: string) => {
  const resources = new Set<string>()
  const actions = new Set<string>()

  for (const route of Object.keys(ROUTE_ACCESS)) {
    if (!route.includes('[')) continue
    if (routeMatches(pathname, route)) {
      const rule = ROUTE_ACCESS[route]
      ;(rule.extraViewerResources ?? []).forEach(r => resources.add(r))
      ;(rule.extraViewerActions ?? []).forEach(a => actions.add(a))
    }
  }

  return {
    resources: Array.from(resources),
    actions: Array.from(actions),
  }
}

/**
 * Check if user can view a route.
 * - Exact/child route co main resources: dung hasRouteAccess
 * - Child route: kiem tra them extraViewerResources/extraViewerActions
 */
export const canViewRoute = (
  userPermissions: string[],
  routeRule: RouteAccessRule,
  pathname?: string
): boolean => {
  // Check main resources
  if (hasRouteAccess(userPermissions, routeRule)) return true

  // Lay extraViewer tu matched route + all dynamic patterns
  const fromMatched = {
    resources: routeRule.extraViewerResources ?? [],
    actions: routeRule.extraViewerActions ?? [],
  }
  const fromPatterns = pathname ? getExtraViewerForPath(pathname) : { resources: [], actions: [] }

  const allResources = Array.from(new Set([...fromMatched.resources, ...fromPatterns.resources]))
  const allActions = Array.from(new Set([...fromMatched.actions, ...fromPatterns.actions]))

  // Neu co actions -> check resource + action
  if (allActions.length > 0) {
    return hasAnyResourcePermission(userPermissions, allResources, allActions)
  }
  // Neu co resources -> chi check resource
  if (allResources.length > 0) {
    return hasAnyResourcePermission(userPermissions, allResources)
  }

  return false
}

/**
 * Lay danh sach resources user dang co quyen.
 */
export const getAccessibleResources = (userPermissions: string[]): string[] => {
  const resources = userPermissions
    .map(parsePermission)
    .filter((p): p is ParsedPermission => p !== null)
    .map(p => p.resource)
  return Array.from(new Set(resources))
}
