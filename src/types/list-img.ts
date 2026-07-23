import type { GetApiV10FileId200 } from '@/api/models'

export interface ImageFile extends GetApiV10FileId200 {
  id: string
  path: string
  name: string
  mime: string
  size: string
  compress_info?: {
    mobile: string
    tablet: string
    desktop: string
    preload: string
  }
  created_at: string
  updated_at: string
  title?: string
  description?: string
  note?: string
  is_in_library: boolean
}
export interface FilePage {
  page?: number
  pageSize?: number
  count?: number
  rows: ImageFile[]
}
