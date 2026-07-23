"use client"

import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiV10FileQueryKey, usePutApiV10FileId } from '@/api/endpoints/file'
import type { FileUpdate } from '@/api/models'
import type { LibraryFile } from '@/types/library-file'
import { Upload, X } from 'lucide-react'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import baseConfig from '@configs/base'

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'ogg', 'm4v']

const isValidVideoFile = (selectedFile: File): string | null => {
  const maxSize = 200 * 1024 * 1024 // 200MB
  const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ''

  if (selectedFile.size > maxSize) {
    return `File "${selectedFile.name}" vượt quá 200MB`
  }

  const isVideoMime = selectedFile.type.startsWith('video/')
  const isVideoExt = VIDEO_EXTENSIONS.includes(ext)

  if (!isVideoMime && !isVideoExt) {
    return `File "${selectedFile.name}" không phải video hợp lệ`
  }

  return null
}

export const VideoEdit: React.FC<{
  video: LibraryFile
  onClose: () => void
  onSuccess: () => void
}> = ({ video, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const putMutation = usePutApiV10FileId()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: video.title || '',
    description: video.description || '',
    note: video.note || '',
    is_in_library: video.is_in_library,
    file: null as File | null,
  })
  const [previewUrl, setPreviewUrl] = useState('')

  const saving = putMutation.isPending

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const getVideoUrl = (path: string) => `${baseConfig.imgEndpointDomain}${path}`

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const error = isValidVideoFile(selectedFile)
    if (error) {
      toast.error({ title: 'Lỗi', content: error })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFormData({ ...formData, file: selectedFile })
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setFormData({ ...formData, file: null })
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      const updateData: FileUpdate = {
        title: formData.title && formData.title.trim() ? formData.title : null,
        description: formData.description && formData.description.trim() ? formData.description : null,
        note: formData.note && formData.note.trim() ? formData.note : null,
        is_in_library: formData.is_in_library,
      }

      if (formData.file) {
        updateData.file = formData.file
      }

      await putMutation.mutateAsync({
        id: video.id,
        data: updateData,
      })

      await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
      onSuccess()
      toast.success({ title: 'Cập nhật thành công', content: 'Video đã được cập nhật.' })
      onClose()
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Cập nhật thất bại', content: msg })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Chỉnh sửa video</h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center max-h-80 relative group">
              <video
                src={previewUrl || getVideoUrl(video.path)}
                controls
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-white" />
                  <span className="text-sm text-white font-medium">Đổi video</span>
                </div>
              </button>
            </div>

            {formData.file && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{formData.file.name}</p>
                    <p className="text-xs text-blue-700">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={saving}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.mov,.mkv,.webm,.avi,.ogg,.m4v"
              onChange={handleFileChange}
              disabled={saving}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề video"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả video"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Nhập ghi chú"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_in_library_video"
                checked={formData.is_in_library}
                onChange={(e) => setFormData({ ...formData, is_in_library: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
              <label htmlFor="is_in_library_video" className="text-sm text-gray-700 font-medium cursor-pointer">
                Hiện video
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}
