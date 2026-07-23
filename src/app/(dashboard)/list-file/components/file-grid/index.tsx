"use client"

import React from 'react'
import {
  Archive,
  Download,
  Edit,
  FileSpreadsheet,
  FileText,
  FileType,
  Trash2,
} from 'lucide-react'
import type { LibraryFile } from '@/types/library-file'
import baseConfig from '@configs/base'
import Can from '@/acl/Can';
const getExtension = (name: string) => {
  const ext = name.split('.').pop()
  return ext ? ext.toLowerCase() : ''
}

const getFileIcon = (mime: string, fileName: string) => {
  const ext = getExtension(fileName)

  if (mime.includes('sheet') || ['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
  }

  if (mime.includes('zip') || mime.includes('compressed') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <Archive className="h-7 w-7 text-amber-600" />
  }

  if (mime.includes('pdf') || mime.includes('word') || mime.includes('text') || ['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
    return <FileText className="h-7 w-7 text-blue-600" />
  }

  return <FileType className="h-7 w-7 text-gray-600" />
}

const formatFileSize = (bytes: string | number) => {
  const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const FileGrid: React.FC<{
  files: LibraryFile[]
  onEdit: (fileItem: LibraryFile) => void
  onDelete: (fileItem: LibraryFile) => void
}> = ({ files, onEdit, onDelete }) => {
  const handleDownload = async (fileItem: LibraryFile) => {
    try {
      const response = await fetch(`${baseConfig.imgEndpointDomain}${fileItem.path}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileItem.name
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {files.map((fileItem) => (
        <div
          key={fileItem.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 p-4 transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              {getFileIcon(fileItem.mime, fileItem.name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate" title={fileItem.title || fileItem.name}>
                {fileItem.title || fileItem.name}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">{fileItem.name}</p>
              {fileItem.description && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{fileItem.description}</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Kích thước: {formatFileSize(fileItem.size)}</div>
            <div className="text-right uppercase">{getExtension(fileItem.name) || 'FILE'}</div>
            <div className="col-span-2 text-gray-500">{formatDate(fileItem.created_at)}</div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
            <Can I="download" a="gallery_document">
              <button
                onClick={() => handleDownload(fileItem)}
                className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                title="Tải tài liệu"
              >
              <Download className="h-4 w-4" />
            </button>
            </Can>
            <Can I="update" a="gallery_document">
            <button
              onClick={() => onEdit(fileItem)}
              className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </button>
            </Can>
             <Can I="delete" a="gallery_document">
            <button
              onClick={() => onDelete(fileItem)}
              className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
                </Can>
          </div>
        </div>
      ))}
    </div>
  )
}
