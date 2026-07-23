"use client"

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetApiV10FileQueryKey, usePostApiV10File } from '@/api/endpoints/file'
import type { FileUpload as ApiFileUpload } from '@/api/models'
import { Upload, X, FileText } from 'lucide-react'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'

const DOCUMENT_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'csv',
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
]

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'ogg', 'm4v']
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic']

export const FileUpload: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const queryClient = useQueryClient()
  const postMutation = usePostApiV10File()
  const [showForm, setShowForm] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    note: '',
    is_in_library: true,
  })

  const uploading = postMutation.isPending

  const validateFile = (selectedFile: File): string | null => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ''

    if (selectedFile.size > maxSize) {
      return `File "${selectedFile.name}" vượt quá 100MB`
    }

    if (selectedFile.type.startsWith('image/') || IMAGE_EXTENSIONS.includes(ext)) {
      return `File "${selectedFile.name}" là hình ảnh, vui lòng dùng kho ảnh`
    }

    if (selectedFile.type.startsWith('video/') || VIDEO_EXTENSIONS.includes(ext)) {
      return `File "${selectedFile.name}" là video, vui lòng dùng kho video`
    }

    if (!DOCUMENT_EXTENSIONS.includes(ext)) {
      return `File "${selectedFile.name}" chưa nằm trong danh sách tài liệu hỗ trợ`
    }

    return null
  }

  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile)
    if (error) {
      toast.error({ title: 'Lỗi', content: error })
      return
    }

    setFile(selectedFile)
    setShowForm(true)
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
    setShowForm(false)
    setFile(null)
    setFormData({ title: '', description: '', note: '', is_in_library: true })
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      const uploadData: ApiFileUpload = {
        file,
        type: 'DEFAULT',
        title: formData.title || file.name,
        description: formData.description || undefined,
        note: formData.note || undefined,
        is_in_library: true,
      }

      await postMutation.mutateAsync({ data: uploadData })
      await queryClient.invalidateQueries({ queryKey: getGetApiV10FileQueryKey() })
      resetForm()
      toast.success({ title: 'Tải lên thành công', content: 'Tài liệu đã được tải lên.' })
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
          <Upload className="h-4 w-4" /> Tải tài liệu lên
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
              <h3 className="text-xl font-bold">Tải tài liệu lên</h3>
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
                  <p className="text-lg font-medium text-gray-700 mb-1">Kéo thả tài liệu vào đây</p>
                  <p className="text-sm text-gray-500 mb-4">hoặc nhấp để chọn từ máy tính</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.tar,.gz"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer font-medium text-sm">
                      Chọn tài liệu
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      disabled={uploading}
                      className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
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
                        placeholder="Nhập tiêu đề tài liệu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nhập mô tả tài liệu (không bắt buộc)"
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
