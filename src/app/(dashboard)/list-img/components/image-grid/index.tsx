"use client";

import React from "react";
import { Edit, Trash2, Download } from "lucide-react";
import type { ImageFile } from "@/types/list-img";
import baseConfig from "@configs/base";
import Can from '@/acl/Can';
import Image from "next/image";
export const ImageGrid: React.FC<{
  images: ImageFile[];
  onEdit: (image: ImageFile) => void;
  onDelete: (image: ImageFile) => void;
  onRefresh: () => void;
}> = ({ images, onEdit, onDelete }) => {
  const getImageUrl = (image: ImageFile) => {
    // Use compressed version if available, otherwise use original
    const path =
      image.compress_info?.mobile ||
      image.compress_info?.tablet ||
      image.compress_info?.desktop ||
      image.path;
    return baseConfig.imgEndpointDomain + path;
  };

  const formatFileSize = (bytes: string | number) => {
    const size = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (image: ImageFile) => {
    try {
      const response = await fetch(getImageUrl(image));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="group bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-all duration-200"
        >
          {/* Image Container */}
          <div className="relative bg-gray-100 aspect-square overflow-hidden">
            {/* <img
              src={getImageUrl(image)}
              alt={image.title || image.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            /> */}

            <Image
              src={getImageUrl(image)}
              alt={image.title || image.name}
              fill
              sizes="(max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    25vw"
              className="object-contain group-hover:scale-105 transition-transform duration-200"
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2">
              <Can I="dowload" a="gallery">
                <button
                  onClick={() => handleDownload(image)}
                  className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Tải xuống ảnh"
                >
                <Download className="h-5 w-5" />
              </button>
              </Can>
              <Can I="update" a="gallery">
                <button
                  onClick={() => onEdit(image)}
                  className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-5 w-5" />
              </button>
              </Can>
              <Can I="delete" a="gallery">
              <button
                onClick={() => onDelete(image)}
                className="p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              </Can>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div>
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={image.title || image.name}
              >
                {image.title || image.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{image.name}</p>
            </div>

            {image.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {image.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(image.size)}</span>
              <span>{image.mime.split("/")[1]?.toUpperCase()}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
              {formatDate(image.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
