'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  LayoutTemplate,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useGetApiV10Page,
  usePostApiV10Page,
  usePutApiV10PageId,
  useDeleteApiV10PageId,
  getGetApiV10PageQueryKey,
} from '@/api/endpoints/page'
import { PageFormDialog } from './components/page-form-dialog'
import type { Page } from '@/api/models/page'
import type { PageMutateType } from '@/api/models/pageMutateType'
import { Header } from '@/components/layout/header'
import { useAbility } from '@/hooks/use-ability'

export default function PageManagement() {
  const ability = useAbility()
  const queryClient = useQueryClient()

  const canCreatePage = ability.can('create', 'page')
  const canEditPage = ability.can('update', 'page')
  const canDeletePage = ability.can('delete', 'page')

  const [search, setSearch] = useState('')
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingPage, setDeletingPage] = useState<Page | null>(null)

  // Fetch pages
  const { data: pageData, isLoading } = useGetApiV10Page(
    { pageSize: 100 },
    undefined,
  )

  // Mutations
  const createMutation = usePostApiV10Page()
  const updateMutation = usePutApiV10PageId()
  const deleteMutation = useDeleteApiV10PageId()

  // Normalize
  const pages: Page[] = React.useMemo(() => {
    if (!pageData) return []
    const rows = (pageData as { responseData?: { rows?: Page[] } })?.responseData?.rows
    return Array.isArray(rows) ? rows : []
  }, [pageData])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return pages
    const q = search.toLowerCase()
    return pages.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.path?.toLowerCase().includes(q),
    )
  }, [pages, search])

  const isMutating = createMutation.isPending || updateMutation.isPending

  // Handlers
  const handleOpenCreate = () => {
    setEditingPage(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (page: Page) => {
    setEditingPage(page)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (
    values: { name: string; type: PageMutateType; description?: string; path?: string },
  ) => {
    try {
      if (editingPage?.id) {
        await updateMutation.mutateAsync({
          id: editingPage.id,
          data: {
            name: values.name,
            type: values.type,
            description: values.description,
            path: values.path,
          },
        })
        toast.success('Cập nhật trang thành công')
      } else {
        await createMutation.mutateAsync({
          data: {
            name: values.name,
            type: values.type,
            description: values.description,
            path: values.path,
          },
        })
        toast.success('Tạo trang thành công')
      }
      queryClient.invalidateQueries({ queryKey: getGetApiV10PageQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deletingPage?.id) return
    try {
      await deleteMutation.mutateAsync({ id: deletingPage.id })
      toast.success('Xóa trang thành công')
      queryClient.invalidateQueries({ queryKey: getGetApiV10PageQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    } finally {
      setDeletingPage(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Quản lý trang" />
      <main className="flex-1 space-y-6 p-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý trang</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý danh sách các trang của hệ thống
            </p>
          </div>
          {canCreatePage && (
            <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Thêm trang
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm trang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium">Tên trang</th>
                  <th className="h-10 px-4 text-left font-medium">Loại</th>
                  <th className="h-10 px-4 text-left font-medium">Đường dẫn</th>
                  <th className="h-10 px-4 text-left font-medium">Mô tả</th>
                  <th className="h-10 px-4 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="h-32 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <LayoutTemplate className="h-8 w-8" />
                        <p>Không có trang nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((page) => (
                    <tr key={page.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{page.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {page.type === 'NEWS' ? 'Trang tin tức' : 'Trang thiết kế sẵn'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {page.path || '-'}
                      </td>
                      <td className="max-w-[300px] truncate px-4 py-3 text-muted-foreground">
                        {page.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {canEditPage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(page)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDeletePage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => setDeletingPage(page)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Hiển thị {filtered.length} / {pages.length} trang
        </p>
      </main>

      <PageFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingPage}
        isLoading={isMutating}
      />

      <AlertDialog open={!!deletingPage} onOpenChange={(open) => !open && setDeletingPage(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa trang?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa trang "{deletingPage?.name}"? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
