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
    <div className="flex h-full min-h-[calc(100vh-theme(spacing.16))] flex-col space-y-6 bg-gray-50/30 p-4 md:p-8 dark:bg-gray-950/30">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            <Building2 className="mr-3 h-7 w-7 text-blue-600 dark:text-blue-500" />
            Phòng ban / Khối
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
            Quản lý danh sách phòng ban, khối trong tổ chức và gắn nhân viên.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          disabled={!canCreateDepartment}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-md shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm phòng ban
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm phòng ban..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-900"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filtered.length} / {departments.length} phòng ban
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Mã
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Tên phòng ban
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Mô tả
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Trạng thái
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-gray-400">
                    Không tìm thấy phòng ban nào.
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => (
                  <tr
                    key={dept.id}
                    className="border-b border-gray-50 transition-colors hover:bg-blue-50/30 dark:border-gray-800 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs font-semibold border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                        {dept.code || '—'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {dept.name || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                        {dept.description || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dept.status === 'ACTIVE' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          Không hoạt động
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Assign Users */}
                        {canAddPersonnelDepartment && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:text-blue-400"
                            onClick={() => setAssigningDept(dept)}
                            title="Gắn nhân viên"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Edit */}
                        {canEditDepartment && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:text-emerald-400"
                            onClick={() => handleOpenEdit(dept)}
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete */}
                        {canDeleteDepartment && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:text-red-400"
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
    </div>
    </>
  )
}
