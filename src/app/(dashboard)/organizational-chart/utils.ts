import baseConfig from '@configs/base'

export function getAvatarUrl(avatar?: string | null): string {
  if (!avatar) return ''
  if (/^https?:\/\//i.test(avatar)) return avatar
  if (avatar.startsWith('/')) return `${baseConfig.imgEndpointDomain}${avatar}`
  return `${baseConfig.imgEndpointDomain}/${avatar}`
}
