import {
  AUTH_PRESENCE_COOKIE,
  AUTH_PRESENCE_MAX_AGE_SECONDS,
} from '@/constants/auth-cookie'

export const setAuthPresenceCookie = (): void => {
  if (typeof document === 'undefined') return

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const secure = isHttps ? '; Secure' : ''

  document.cookie = [
    `${AUTH_PRESENCE_COOKIE}=1`,
    'Path=/',
    `Max-Age=${AUTH_PRESENCE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ') + secure
}

export const clearAuthPresenceCookie = (): void => {
  if (typeof document === 'undefined') return

  document.cookie = [
    `${AUTH_PRESENCE_COOKIE}=`,
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax',
  ].join('; ')
}

export const hasAuthPresenceCookie = (): boolean => {
  if (typeof document === 'undefined') return false

  const cookieName = `${AUTH_PRESENCE_COOKIE}=`
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(cookieName))
}
