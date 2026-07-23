"use client"

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiV10FileQueryKey, useDeleteApiV10FileId } from '@/api/endpoints/file'
import { Trash2, X } from 'lucide-react'
import type { LibraryFile } from '@/types/library-file'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import baseConfig from '@configs/base'

export const VideoDelete: React.FC<{
  video: LibraryFile
  onClose: () => void
  onSuccess: () => void
}> = ({ video, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteApiV10FileId()
  const deleting = deleteMutation.isPending

  const getVideoUrl = (path: string) => `${baseConfig.imgEndpointDomain}${path}`

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: video.id })
      await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
      onSuccess()
      onClose()
      toast.success({ title: 'Xóa thành công', content: 'Video đã được xóa.' })
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Xóa thất bại', content: msg })
    }
  }

  const fileSize = Number(video.size)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Xóa video
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
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video max-h-52 mx-auto flex items-center justify-center">
            <video src={getVideoUrl(video.path)} controls className="w-full h-full object-contain" />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">Thao tác này không thể hoàn tác</p>
            <p className="text-sm text-red-700">
              Bạn có chắc chắn muốn xóa video &quot;{video.title || video.name}&quot;?
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên:</span>
              <span className="font-medium text-gray-900 truncate ml-2">{video.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kích thước:</span>
              <span className="font-medium text-gray-900">
                {fileSize / 1024 / 1024 < 1
                  ? `${(fileSize / 1024).toFixed(2)} KB`
                  : `${(fileSize / 1024 / 1024).toFixed(2)} MB`}
              </span>
            </div>
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
            {deleting ? 'Đang xóa...' : 'Xóa video'}
          </button>
        </div>
      </div>
    </div>
  )
}
