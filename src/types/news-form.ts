/**
 * News Form Types
 * Shared types for news create/edit pages
 */

import type { PostContentSection } from '@/components/features/news/PostContentEditor'
import type { ImagePickerFile } from '@/components/shared/image-picker'

// =============================================================================
// NEWS FORM STATE
// =============================================================================

export interface NewsFormState {
  title: string
  code: string
  summary: string
  postSections: PostContentSection[]
  position: number
  isHidden: boolean
  isService: boolean
  expiredAt: string
  publishedAt: string
  selectedThumbnail: ImagePickerFile | null
  selectedCategories: string[]
}

// =============================================================================
// NEWS FORM DEFAULTS
// =============================================================================

export const NEWS_FORM_DEFAULTS: NewsFormState = {
  title: '',
  code: '',
  summary: '',
  postSections: [],
  position: 1,
  isHidden: false,
  isService: false,
  expiredAt: '',
  publishedAt: '',
  selectedThumbnail: null,
  selectedCategories: [],
}

// =============================================================================
// NEWS FORM IMAGE DISPLAY (for detail page)
// =============================================================================

export interface NewsImageDisplayFile {
  file_id: string
  file?: {
    compress_info?: {
      mobile?: string
      tablet?: string
      desktop?: string
      preload?: string
    }
  }
}

// =============================================================================
// NEWS CONTENT SECTION (for detail page display)
// =============================================================================

export interface NewsContentSectionDisplay {
  content?: string
  post_content_images?: NewsImageDisplayFile[]
  image_columns?: number
  image_rows?: number
}
