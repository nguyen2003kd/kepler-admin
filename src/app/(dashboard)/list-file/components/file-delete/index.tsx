"use client"

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiV10FileQueryKey, useDeleteApiV10FileId } from '@/api/endpoints/file'
import type { LibraryFile } from '@/types/library-file'
import { FileText, Trash2, X } from 'lucide-react'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'

export const FileDelete: React.FC<{
  fileItem: LibraryFile
  onClose: () => void
  onSuccess: () => void
}> = ({ fileItem, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteApiV10FileId()
  const deleting = deleteMutation.isPending

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: fileItem.id })
      await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
      onSuccess()
      onClose()
      toast.success({ title: 'Xóa thành công', content: 'Tài liệu đã được xóa.' })
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Xóa thất bại', content: msg })
    }
  }

  const fileSize = Number(fileItem.size)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Xóa tài liệu
          </h3>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{fileItem.name}</p>
              <p className="text-xs text-gray-600">
                {fileSize / 1024 / 1024 < 1
                  ? `${(fileSize / 1024).toFixed(2)} KB`
                  : `${(fileSize / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">Thao tác này không thể hoàn tác</p>
            <p className="text-sm text-red-700">
              Bạn có chắc chắn muốn xóa tài liệu &quot;{fileItem.title || fileItem.name}&quot;?
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {deleting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
            {deleting ? 'Đang xóa...' : 'Xóa tài liệu'}
          </button>
        </div>
      </div>
    </div>
  )
}
