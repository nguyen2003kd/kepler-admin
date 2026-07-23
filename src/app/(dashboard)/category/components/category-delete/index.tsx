"use client"

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useDeleteApiV10CategoryId } from '@/api/endpoints/category'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'

export const CategoryDelete: React.FC<{ id: string }> = ({ id }) => {
  const deleteMutation = useDeleteApiV10CategoryId()
  const queryClient = useQueryClient()

  const deleting = deleteMutation.isPending

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return
    try {
      await deleteMutation.mutateAsync({ id })
      await queryClient.invalidateQueries({ queryKey: ['/api/v1.0/category'] })
      toast.success({ title: 'Xóa danh mục thành công', content: 'Danh mục đã được xóa.' })
    } catch (err: unknown) {
      console.error(err)
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Xóa danh mục thất bại', content: msg })
    }
  }

  return (
    <Button variant="ghost" className="text-red-600" onClick={handleDelete} disabled={deleting}>
      <Trash className="mr-2 h-4 w-4" />
      Xóa
    </Button>
  )
}
