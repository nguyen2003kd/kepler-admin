"use client"

import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiV10FileQueryKey, usePostApiV10File } from '@/api/endpoints/file'
import type { FileUpload } from '@/api/models'
import { Upload, X } from 'lucide-react'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import { extractVideoThumbnail } from '@/utils/video-thumbnail'
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'ogg', 'm4v']

export const VideoUpload: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const queryClient = useQueryClient()
  const postMutation = usePostApiV10File()
  const [showForm, setShowForm] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    note: '',
    is_in_library: true,
  })

  const uploading = postMutation.isPending

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const validateFile = (selectedFile: File): string | null => {
    // const maxSize = 200 * 1024 * 1024 // 200MB
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ''

    // if (selectedFile.size > maxSize) {
    //   return `File "${selectedFile.name}" vượt quá 200MB`
    // }

    const isVideoMime = selectedFile.type.startsWith('video/')
    const isVideoExt = VIDEO_EXTENSIONS.includes(ext)

    if (!isVideoMime && !isVideoExt) {
      return `File "${selectedFile.name}" không phải video hợp lệ`
    }

    return null
  }

  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile)
    if (error) {
      toast.error({ title: 'Lỗi', content: error })
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl)

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setThumbnailUrl('')
    setShowForm(true)

    // Generate thumbnail from video (local blob)
    extractVideoThumbnail(URL.createObjectURL(selectedFile), 0.8, 0.8)
      .then((thumb) => {
        if (thumb) setThumbnailUrl(thumb)
      })
      .catch(() => {})
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl)
    setShowForm(false)
    setFile(null)
    setPreviewUrl('')
    setThumbnailUrl('')
    setFormData({ title: '', description: '', note: '', is_in_library: true })
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      const uploadData: FileUpload = {
        file,
        type: 'video',
        title: formData.title || file.name,
        description: formData.description || undefined,
        note: formData.note || undefined,
        is_in_library: true,
      }

      await postMutation.mutateAsync({ data: uploadData })
      await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
      resetForm()
      toast.success({ title: 'Tải lên thành công', content: 'Video đã được tải lên.' })
      onSuccess?.()
    } catch (err: unknown) {
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Tải thất bại', content: msg })
    }
  }

  return (
    <>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          <Upload className="h-4 w-4" /> Tải video lên
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
              <h3 className="text-xl font-bold">Tải video lên</h3>
              <button
                onClick={resetForm}
                disabled={uploading}
                className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-1">Kéo thả video vào đây</p>
                  <p className="text-sm text-gray-500 mb-4">hoặc nhấp để chọn từ máy tính</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-matroska,video/webm,video/x-msvideo,video/ogg,video/x-m4v,.mp4,.mov,.mkv,.webm,.avi,.ogg,.m4v"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer font-medium text-sm">
                      Chọn video
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    <video
                      src={previewUrl}
                      controls
                      poster={thumbnailUrl || undefined}
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setFile(null)}
                      disabled={uploading}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề video"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nhập mô tả video (không bắt buộc)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                      <input
                        type="text"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Nhập ghi chú (không bắt buộc)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={resetForm}
                disabled={uploading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                {uploading ? 'Đang tải...' : 'Tải lên'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
