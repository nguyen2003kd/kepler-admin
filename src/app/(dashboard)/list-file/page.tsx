"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { getApiV10File, getGetApiV10FileQueryKey } from '@/api/endpoints/file'
import Can from '@/acl/Can'
import { useAbility } from '@/hooks/use-ability'
import type { LibraryFile, LibraryFilePage } from '@/types/library-file'
import { FileUpload } from './components/file-upload'
import { FileGrid } from './components/file-grid'
import { FileEdit } from './components/file-edit'
import { FileDelete } from './components/file-delete'
const buildDocumentFilter = (searchTerm: string) => {
  const baseFilter = 'is_in_library==true,type==DEFAULT'
  if (!searchTerm) return baseFilter
  return `(title|description|note)@=${encodeURI(searchTerm)},${baseFilter}`
}

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const ability = useAbility()
  const [pageSize] = useState(12)
  const [editingFile, setEditingFile] = useState<LibraryFile | null>(null)
  const [deletingFile, setDeletingFile] = useState<LibraryFile | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const {
    data: infiniteData,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<LibraryFilePage, Error, InfiniteData<LibraryFilePage>, readonly unknown[], number>({
    queryKey: ['files', 'library-documents', pageSize, searchTerm],
    queryFn: async ({ pageParam = 1, signal }) => {
      const res = await getApiV10File(
        {
          page: pageParam,
          pageSize,
          filters: buildDocumentFilter(searchTerm),
          sortField: 'created_at',
          sortOrder: 'desc',
        },
        signal
      )

      if (res.status !== 'success') {
        throw new Error(res.message ?? 'Get file error')
      }

      const responseData = (res as { responseData?: Partial<LibraryFilePage> })?.responseData ?? {}

      return {
        page: responseData.page ?? pageParam,
        pageSize: responseData.pageSize ?? pageSize,
        count: typeof responseData.count === 'number' ? responseData.count : 0,
        rows: Array.isArray(responseData.rows) ? (responseData.rows as LibraryFile[]) : [],
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

  const files: LibraryFile[] = React.useMemo(() => {
    if (!infiniteData?.pages) return []
    return infiniteData.pages.flatMap((p) => p.rows || [])
  }, [infiniteData])

  const totalCount = React.useMemo(() => infiniteData?.pages?.[0]?.count ?? 0, [infiniteData])

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
    await refetch()
  }

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root: null, rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div>
      <Header title="Kho tài liệu" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Kho lưu trữ tài liệu</h2>
              <p className="text-muted-foreground mt-1">Quản lý tài liệu của bạn ({totalCount} tệp)</p>
            </div>
            <Can I="upload" a="gallery_document">
              <FileUpload onSuccess={handleRefresh} />
            </Can>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải tài liệu...</p>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Chưa có tài liệu nào</p>
                <p className="text-gray-400 text-sm">Hãy bắt đầu bằng cách thêm tài liệu đầu tiên</p>
              </div>
            </div>
          ) : (
            <>
              <FileGrid
                files={files}
                onEdit={(item) => {
                  if (ability.can('update', 'gallery')) setEditingFile(item)
                }}
                onDelete={(item) => {
                  if (ability.can('delete', 'gallery_document')) setDeletingFile(item)
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">Hiển thị {files.length} / {totalCount} tệp</div>
                <div className="text-sm text-gray-600">
                  {isFetchingNextPage ? 'Đang tải thêm...' : hasNextPage ? 'Kéo để tải thêm' : 'Đã tải hết tài liệu'}
                </div>
              </div>

              <div ref={loadMoreRef} className="h-1" />
            </>
          )}

          {editingFile && (
            <FileEdit
              fileItem={editingFile}
              onClose={() => setEditingFile(null)}
              onSuccess={handleRefresh}
            />
          )}

          {deletingFile && (
            <FileDelete
              fileItem={deletingFile}
              onClose={() => setDeletingFile(null)}
              onSuccess={handleRefresh}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default Page
