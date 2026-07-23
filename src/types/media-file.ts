/**
 * Media File Types
 * Shared types for list-file, list-img, and list-video pages
 */

// =============================================================================
// FILE FILTER BUILDERS
// =============================================================================

/**
 * Build filter string for document files (list-file page)
 */
export const buildDocumentFilter = (searchTerm: string): string => {
  const baseFilter = 'is_in_library==true,type==file'
  if (!searchTerm) return baseFilter
  return `(title|description|note)@=${encodeURI(searchTerm)},${baseFilter}`
}

/**
 * Build filter string for image files (list-img page)
 */
export const buildImageFilter = (searchTerm: string): string => {
  const baseFilter = 'is_in_library==true,type==image'
  if (!searchTerm) return baseFilter
  return `(title|description|note)@=${encodeURI(searchTerm)},${baseFilter}`
}

/**
 * Build filter string for video files (list-video page)
 */
export const buildVideoFilter = (searchTerm: string): string => {
  const baseFilter = 'is_in_library==true,type==video'
  if (!searchTerm) return baseFilter
  return `(title|description|note)@=${encodeURI(searchTerm)},${baseFilter}`
}

// =============================================================================
// MEDIA FILE TYPES (shared with library-file.ts)
// =============================================================================

export interface MediaFileFilter {
  searchTerm: string
  page: number
  pageSize: number
}
