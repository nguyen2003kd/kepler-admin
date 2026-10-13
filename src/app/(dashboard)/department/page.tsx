'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Users,
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
  useGetApiV10Department,
  usePostApiV10Department,
  usePutApiV10DepartmentId,
  useDeleteApiV10DepartmentId,
  getGetApiV10DepartmentQueryKey,
} from '@/api/endpoints/department'
import { DepartmentFormDialog } from './components/department-form-dialog'
import { AssignUserDialog } from './components/assign-user-dialog'
import type { Department } from '@/api/models/department'
import { Header } from '@/components/layout/header'
import { useAbility } from '@/hooks/use-ability'
export default function DepartmentPage() {
  const ability = useAbility()
  const queryClient = useQueryClient()

  const canCreateDepartment = ability.can('creat_department', 'department')
  const canEditDepartment = ability.can('edit_department', 'department')
  const canDeleteDepartment = ability.can('delete_department', 'department')
  const canAddPersonnelDepartment = ability.can('add_personnel_department', 'department')

  const [search, setSearch] = useState('')
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingDept, setDeletingDept] = useState<Department | null>(null)
  const [assigningDept, setAssigningDept] = useState<Department | null>(null)

  // Fetch departments
  const { data: deptData, isLoading } = useGetApiV10Department(
    { pageSize: 100 },
    undefined,
  )

  // Mutations
  const createMutation = usePostApiV10Department()
  const updateMutation = usePutApiV10DepartmentId()
  const deleteMutation = useDeleteApiV10DepartmentId()

  // Normalize
  const departments: Department[] = React.useMemo(() => {
    if (!deptData) return []
    const rows = (deptData as { responseData?: { rows?: Department[] } })?.responseData?.rows
    return Array.isArray(rows) ? rows : []
  }, [deptData])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return departments
    const q = search.toLowerCase()
    return departments.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q),
    )
  }, [departments, search])

  const isMutating = createMutation.isPending || updateMutation.isPending

  // Handlers
  const handleOpenCreate = () => {
    setEditingDept(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (
    values: { name: string; code: string; description?: string; status?: string },
  ) => {
    try {
      if (editingDept?.id) {
        await updateMutation.mutateAsync({
          id: editingDept.id,
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            status: values.status as 'ACTIVE' | 'INACTIVE',
          },
        })
        toast.success('Cập nhật phòng ban thành công')
      } else {
        await createMutation.mutateAsync({
          data: {
            name: values.name,
            code: values.code,
            description: values.description,
            status: (values.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
          },
        })
        toast.success('Tạo phòng ban thành công')
      }
      await queryClient.invalidateQueries({ queryKey: getGetApiV10DepartmentQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deletingDept?.id) return
    try {
      await deleteMutation.mutateAsync({ id: deletingDept.id })
      toast.success('Xóa phòng ban thành công')
      setDeletingDept(null)
      await queryClient.invalidateQueries({ queryKey: getGetApiV10DepartmentQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <>
    <Header title="Phòng ban / Khối" />
    <main className="flex-1 space-y-6 p-6">

      {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Phòng ban / Khối
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh sách phòng ban, khối trong tổ chức và gắn nhân viên.
          </p>
        </div>

        {canCreateDepartment && (
          <Button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm phòng ban
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm phòng ban..."
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
                <th className="h-10 whitespace-nowrap px-4 text-left font-medium">
                  Mã
                </th>
                <th className="h-10 whitespace-nowrap px-4 text-left font-medium">
                  Tên phòng ban
                </th>
                <th className="h-10 whitespace-nowrap px-4 text-left font-medium">
                  Mô tả
                </th>
                <th className="h-10 whitespace-nowrap px-4 text-left font-medium">
                  Trạng thái
                </th>
                <th className="h-10 whitespace-nowrap px-4 text-right font-medium">
                  Thao tác
                </th>
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
                      <Building2 className="h-8 w-8" />
                      <p>Không có phòng ban nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => (
                  <tr
                    key={dept.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {dept.code || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{dept.name || '—'}</p>
                    </td>
                    <td className="max-w-[300px] px-4 py-3">
                      <p className="truncate text-muted-foreground">
                        {dept.description || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {dept.status === 'ACTIVE' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Không hoạt động
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Assign Users */}
                        {canAddPersonnelDepartment && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setAssigningDept(dept)}
                            title="Gắn nhân viên"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Edit */}
                        {canEditDepartment && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(dept)}
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete */}
                        {canDeleteDepartment && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeletingDept(dept)}
                            title="Xóa"
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
        Hiển thị {filtered.length} / {departments.length} phòng ban
      </p>

      {/* Form Dialog */}
      <DepartmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingDept}
        isLoading={isMutating}
      />

      {/* Assign User Dialog */}
      <AssignUserDialog
        open={!!assigningDept}
        onOpenChange={(open) => !open && setAssigningDept(null)}
        department={assigningDept}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ['user-departments', assigningDept?.id] })
        }
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingDept} onOpenChange={(open) => !open && setDeletingDept(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phòng ban</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phòng ban{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {deletingDept?.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
    </>
  )
}
