"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { getApiV10File} from '@/api/endpoints/file'
import { getGetApiV10FileQueryKey } from '@/api/endpoints/file'
import { ImageUpload } from './components/image-upload'
import { ImageGrid } from './components/image-grid'
import { ImageEdit } from './components/image-edit'
import { ImageDelete } from './components/image-delete'
import type { ImageFile ,FilePage} from '@/types/list-img'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import Can from '@/acl/Can'
import { useAbility } from '@/hooks/use-ability'

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const ability = useAbility()
  // removed manual `page` state: use infinite query instead
  const [pageSize] = useState(12)
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null)
  const [deletingImage, setDeletingImage] = useState<ImageFile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Fetch images with pagination
  // const { data, isLoading } = useGetApiV10File(
  //   {
  //     page,
  //     pageSize,
  //     filters:'is_in_library==true',
  //     sortField: 'created_at',
  //     sortOrder: 'desc',
  //   },
  //   { query: {} }
  // )
const {
  data: infiniteData,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  refetch,
} = useInfiniteQuery<FilePage, Error, InfiniteData<FilePage>, readonly unknown[], number>({
  queryKey: ['files', 'library', pageSize, searchTerm],
  queryFn: async ({ pageParam = 1, signal }) => {
    const res = await getApiV10File({
      page: pageParam,
      pageSize: pageSize,
      filters: searchTerm ? `(title|description|note)@=${searchTerm},is_in_library==true,type==IMAGE` : 'is_in_library==true,type==IMAGE',
      sortField: 'created_at',
      sortOrder: 'desc',
    }, signal)

    if (res.status !== 'success') {
      throw new Error(res.message ?? 'Get file error')
    }

    const responseData = (res as { responseData?: Partial<FilePage> })?.responseData ?? {}

    return {
      page: responseData.page ?? pageParam,
      pageSize: responseData.pageSize ?? pageSize,
      count: typeof responseData.count === 'number' ? responseData.count : 0,
      rows: Array.isArray(responseData.rows) ? (responseData.rows as ImageFile[]) : [],
    }
  },
  getNextPageParam: (lastPage) => {
    const p = lastPage.page ?? 1
    const ps = lastPage.pageSize ?? pageSize
    const total = lastPage.count ?? 0
    const totalPages = ps > 0 ? Math.ceil(total / ps) : undefined
    return totalPages && p < totalPages ? p + 1 : undefined
  },
  initialPageParam: 1,
  staleTime: 30_000,
})
  // Flatten pages into a single images array
  const images: ImageFile[] = React.useMemo(() => {
    if (!infiniteData?.pages) return []
    return infiniteData.pages.flatMap((p) => p.rows || [])
  }, [infiniteData])

  const totalCount = React.useMemo(() => {
    return infiniteData?.pages?.[0]?.count ?? 0
  }, [infiniteData])

  const handleRefresh = async () => {
    // refetch the infinite query and reset pages
    await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
    refetch()
  }

  const handleEditClose = () => {
    setEditingImage(null)
  }

  const handleDeleteClose = () => {
    setDeletingImage(null)
  }

  // IntersectionObserver to auto-load next page when sentinel becomes visible
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }
      },
      { root: null, rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div>
      <Header title="Kho ảnh" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Kho lưu trữ ảnh</h2>
              <p className="text-muted-foreground mt-1">
                Quản lý hình ảnh của bạn ({totalCount} ảnh)
              </p>
            </div>
            <Can I="upload" a="gallery">
              <ImageUpload onSuccess={handleRefresh} />
            </Can>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                // infinite query key includes `searchTerm`, so it will reset automatically
              }}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải ảnh...</p>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Chưa có ảnh nào</p>
                <p className="text-gray-400 text-sm">Hãy bắt đầu bằng cách thêm ảnh đầu tiên</p>
              </div>
            </div>
          ) : (
            <>
              <ImageGrid
                images={images}
                onEdit={(img) => { if (ability.can('update', 'gallery')) setEditingImage(img); }}
                onDelete={(img) => { if (ability.can('delete', 'gallery')) setDeletingImage(img); }}
                onRefresh={handleRefresh}
              />
              {/* Infinite scroll status */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">Hiển thị {images.length} / {totalCount} ảnh</div>
                <div className="text-sm text-gray-600">{isFetchingNextPage ? 'Đang tải thêm...' : hasNextPage ? 'Kéo để tải thêm' : 'Đã tải hết ảnh'}</div>
              </div>

              {/* Sentinel for IntersectionObserver */}
              <div ref={loadMoreRef} className="h-1" />
            </>
          )}


          {/* Edit Modal */}
          {editingImage && (
            <ImageEdit image={editingImage} onClose={handleEditClose} onSuccess={handleRefresh} />
          )}

          {/* Delete Modal */}
          {deletingImage && (
            <ImageDelete image={deletingImage} onClose={handleDeleteClose} onSuccess={handleRefresh} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Page
