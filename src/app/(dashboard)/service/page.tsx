"use client"

import React, { useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/header"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmModal, useConfirmModal } from "@/components/shared/confirm-modal"
import { ServiceCreate, ServiceEdit, createServiceColumns } from "./components"
import {
  useGetApiV10Service,
  usePostApiV10Service,
  usePutApiV10ServiceId,
  useDeleteApiV10ServiceId,
  getGetApiV10ServiceQueryKey,
} from "@/api/endpoints/service"
import type { Service } from "@/api/models/service"
import type { ServiceMutate } from "@/api/models/serviceMutate"
import { toast } from "@/components/ui/toaster"
import { extractErrorMessage } from "@/utils/error"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAbility } from "@/hooks/use-ability"
import Can from "@/acl/Can"

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const ability = useAbility()
  const { confirm } = useConfirmModal()

  // Data fetching
  const { data: servicesData, isLoading } = useGetApiV10Service()

  // Mutations
  const createMutation = usePostApiV10Service()
  const updateMutation = usePutApiV10ServiceId()
  const deleteMutation = useDeleteApiV10ServiceId()

  // UI state
  const [createOpen, setCreateOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Normalize rows from API response
  const services: Service[] = React.useMemo(() => {
    const rows = servicesData?.responseData?.rows
    if (Array.isArray(rows)) return rows
    return []
  }, [servicesData])

  const canDelete = ability.can("delete", "service")
  const canEdit = ability.can("edit", "service")

  // Handlers
  const handleEdit = useCallback((service: Service) => {
    if (!canEdit) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền sửa dịch vụ này",
      })
      return
    }
    setEditingService(service)
    setEditOpen(true)
  }, [canEdit])

  const handleDelete = useCallback(async (id: string) => {
    if (!ability.can("delete", "service")) {
      toast.error({
        title: "Không có quyền",
        content: "Bạn không có quyền xóa dịch vụ này",
      })
      return
    }

    const confirmed = await confirm({
      title: "Xác nhận xóa",
      description:
        "Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy bỏ",
      variant: "destructive",
    })
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteMutation.mutateAsync({ id })
      toast.success({ title: "Thành công", content: "Đã xóa dịch vụ thành công" })
      queryClient.invalidateQueries({
        queryKey: getGetApiV10ServiceQueryKey(),
      })
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error({ title: "Xóa thất bại", content: msg })
    } finally {
      setDeletingId(null)
    }
  }, [ability, confirm, deleteMutation, queryClient])

  const handleCreate = async (data: ServiceMutate) => {
    await createMutation.mutateAsync({ data })
    toast.success({
      title: "Thành công",
      content: "Đã tạo dịch vụ mới thành công",
    })
    queryClient.invalidateQueries({
      queryKey: getGetApiV10ServiceQueryKey(),
    })
  }

  const handleUpdate = async (data: ServiceMutate) => {
    if (!editingService?.id) return
    await updateMutation.mutateAsync({ id: editingService.id, data })
    toast.success({
      title: "Thành công",
      content: "Đã cập nhật dịch vụ thành công",
    })
    queryClient.invalidateQueries({
      queryKey: getGetApiV10ServiceQueryKey(),
    })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetApiV10ServiceQueryKey() })
  }

  // Columns
  const columns = React.useMemo(
    () =>
      createServiceColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        deletingId: deletingId,
        canDelete,
        canEdit,
      }),
    [handleEdit, handleDelete, deletingId, canDelete, canEdit]
  )

  return (
    <>
      <Header title="Dịch vụ" />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Dịch vụ</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách dịch vụ của website
            </p>
          </div>
          <Can I="create" a="service">
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm dịch vụ
            </Button>
          </Can>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={services}
          searchPlaceholder="Tìm kiếm dịch vụ..."
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Modals */}
      <ServiceCreate
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <ServiceEdit
        service={editingService}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditingService(null)
        }}
        onSubmit={handleUpdate}
      />

      <ConfirmModal />
    </>
  )
}

export default Page
