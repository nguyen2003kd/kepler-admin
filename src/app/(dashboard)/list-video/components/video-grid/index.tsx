"use client"

import React from 'react'
import { Download, Edit, Play, Trash2 } from 'lucide-react'
import baseConfig from '@configs/base'
import type { LibraryFile } from '@/types/library-file'
import Can from '@/acl/Can';
export const VideoGrid: React.FC<{
  videos: LibraryFile[]
  onEdit: (video: LibraryFile) => void
  onDelete: (video: LibraryFile) => void
}> = ({ videos, onEdit, onDelete }) => {
  const getFileUrl = (video: LibraryFile) => `${baseConfig.imgEndpointDomain}${video.path}`

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

  const handleDownload = async (video: LibraryFile) => {
    try {
      const response = await fetch(getFileUrl(video))
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = video.name
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading video:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-all duration-200"
        >
          <div className="relative bg-black aspect-video overflow-hidden">
            <video
              src={getFileUrl(video)}
              controls
              preload="metadata"
              poster={
                video.compress_info?.preload
                  ? `${baseConfig.imgEndpointDomain}${video.compress_info.preload}`
                  : video.compress_info?.desktop
                    ? `${baseConfig.imgEndpointDomain}${video.compress_info.desktop}`
                    : video.compress_info?.tablet
                      ? `${baseConfig.imgEndpointDomain}${video.compress_info.tablet}`
                      : undefined
              }
              className="w-full h-full object-contain"
            />

            <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Can I="download" a="gallery_video">
                <button
                  onClick={() => handleDownload(video)}
                  className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
                  title="Tải video"
                >
                  <Download className="h-4 w-4" />
              </button>
              </Can>
              <Can I="update" a="gallery_video">
                <button
                  onClick={() => onEdit(video)}
                  className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </Can>
              <Can I="delete" a="gallery_video">
                <button
                  onClick={() => onDelete(video)}
                className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
                </Can>
            </div>
          </div>

          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate" title={video.title || video.name}>
                  {video.title || video.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{video.name}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                <Play className="h-3 w-3" /> VIDEO
              </span>
            </div>

            {video.description && <p className="text-xs text-gray-600 line-clamp-2">{video.description}</p>}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(video.size)}</span>
              <span>{video.mime.split('/')[1]?.toUpperCase() || 'VIDEO'}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">{formatDate(video.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
