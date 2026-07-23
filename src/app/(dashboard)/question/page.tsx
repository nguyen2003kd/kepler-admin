"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/header"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmModal, useConfirmModal } from "@/components/shared/confirm-modal"
import { toast } from "@/components/ui/toaster"
import { extractErrorMessage } from "@/utils/error"

import type { Question } from "@/api/models/question"
import type { QuestionMutate } from "@/api/models/questionMutate"

import {
  getGetApiV10QuestionQueryKey,
  useDeleteApiV10QuestionId,
  useGetApiV10Question,
  usePutApiV10QuestionId,
} from "@/api/endpoints/question"

import { createQuestionColumns, QuestionDetail, QuestionEdit } from "./components"

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const { confirm } = useConfirmModal()

  const { data: questionData, isLoading } = useGetApiV10Question()

  const updateMutation = usePutApiV10QuestionId()
  const deleteMutation = useDeleteApiV10QuestionId()

  const [viewing, setViewing] = useState<Question | null>(null)
  const [editing, setEditing] = useState<Question | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const rows: Question[] = useMemo(() => {
    const r = (questionData as { responseData?: { rows?: Question[] } } | undefined)?.responseData?.rows
    if (Array.isArray(r)) return r
    return []
  }, [questionData])

  const canEdit = true
  const canDelete = true

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetApiV10QuestionQueryKey() })
  }

  const handleView = useCallback((item: Question) => {
    setViewing(item)
  }, [])

  const handleEdit = useCallback((item: Question) => {
    setEditing(item)
    setEditOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = await confirm({
        title: "Xác nhận xóa",
        description: "Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.",
        confirmText: "Xóa",
        cancelText: "Hủy bỏ",
        variant: "destructive",
      })
      if (!confirmed) return

      setDeletingId(id)
      try {
        await deleteMutation.mutateAsync({ id })
        toast.success({ title: "Thành công", content: "Đã xóa liên hệ thành công" })
        queryClient.invalidateQueries({ queryKey: getGetApiV10QuestionQueryKey() })
      } catch (error) {
        const msg = extractErrorMessage(error)
        toast.error({ title: "Xóa thất bại", content: msg })
      } finally {
        setDeletingId(null)
      }
    },
    [confirm, deleteMutation, queryClient]
  )

  const handleUpdate = async (id: string, data: QuestionMutate) => {
    try {
      await updateMutation.mutateAsync({ id, data })
      toast.success({ title: "Thành công", content: "Đã cập nhật liên hệ thành công" })
      queryClient.invalidateQueries({ queryKey: getGetApiV10QuestionQueryKey() })
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error({ title: "Cập nhật thất bại", content: msg })
      throw error
    }
  }

  const columns = useMemo(
    () =>
      createQuestionColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        deletingId,
        canDelete,
        canEdit,
      }),
    [handleView, handleEdit, handleDelete, deletingId, canDelete, canEdit]
  )

  return (
    <>
      <Header title="Liên hệ" />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Liên hệ</h2>
          <p className="text-muted-foreground">Danh sách câu hỏi từ người dùng</p>
        </div>

        <DataTable
          columns={columns}
          data={rows}
          searchPlaceholder="Tìm kiếm liên hệ..."
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </div>

      <QuestionDetail item={viewing} open={Boolean(viewing)} onClose={() => setViewing(null)} />

      <QuestionEdit
        item={editing}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditing(null)
        }}
        onSubmit={handleUpdate}
      />

      <ConfirmModal />
    </>
  )
}

export default Page
