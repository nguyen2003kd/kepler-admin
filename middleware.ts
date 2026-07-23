import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_ACCESS } from './src/configs/permissions-matrix'
import { AUTH_PRESENCE_COOKIE } from './src/constants/auth-cookie'

const BASE_PATH = '/admin'
const PUBLIC_PATHS = new Set(['/login', '/401', '/403', '/404', '/500'])
const BYPASS_PREFIXES = ['/api', '/_next']
const BYPASS_EXACT = new Set(['/favicon.ico', '/robots.txt', '/sitemap.xml'])

const routeKeys = Object.keys(ROUTE_ACCESS).sort((a, b) => b.length - a.length)

const stripBasePath = (pathname: string): string => {
  if (pathname === BASE_PATH) return '/'
  if (pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname.slice(BASE_PATH.length)
  }
  return pathname
}

const withBasePath = (pathname: string): string => {
  if (!pathname.startsWith('/')) return `${BASE_PATH}/${pathname}`
  return `${BASE_PATH}${pathname}`
}

const isProtectedPath = (pathname: string): boolean => {
  return routeKeys.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

const isBypassPath = (pathname: string): boolean => {
  if (BYPASS_EXACT.has(pathname)) return true
  return BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function middleware(request: NextRequest) {
  const rawPath = request.nextUrl.pathname
  const pathname = stripBasePath(rawPath)

  if (isBypassPath(pathname)) {
    return NextResponse.next()
  }

  const hasAuthCookie = !!request.cookies.get(AUTH_PRESENCE_COOKIE)?.value

  if (pathname === '/') {
    const redirectUrl = new URL(
      withBasePath(hasAuthCookie ? '/dashboard' : '/login'),
      request.url
    )
    return NextResponse.redirect(redirectUrl)
  }

  if (PUBLIC_PATHS.has(pathname)) {
    if (pathname === '/login' && hasAuthCookie) {
      const redirectUrl = new URL(withBasePath('/dashboard'), request.url)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  if (isProtectedPath(pathname) && !hasAuthCookie) {
    const loginUrl = new URL(withBasePath('/login'), request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*).*)'],
}
