"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteApiV10FileId,
  getGetApiV10FileQueryKey,
} from "@/api/endpoints/file";
import { Trash2, X } from "lucide-react";
import type { ImageFile } from "@/types/list-img";
import Image from "next/image";
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import baseConfig from "@/configs/base";
export const ImageDelete: React.FC<{
  image: ImageFile;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ image, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteApiV10FileId();
  const deleting = deleteMutation.isPending;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: image.id });
      await queryClient.invalidateQueries({
        queryKey: getGetApiV10FileQueryKey(),
      });
      onSuccess();
      onClose();
      toast.success({ title: 'Xóa thành công', content: 'Ảnh đã được xóa.' })
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Xóa thất bại', content: msg })
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Xóa ảnh
          </h3>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Image Preview */}
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square max-h-48 mx-auto flex items-center justify-center relative">
            <Image
              src={`${baseConfig.imgEndpointDomain}${image.compress_info?.mobile || image.compress_info?.tablet || image.compress_info?.desktop || image.path}`}
              alt={image.title || image.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 192px"
            />
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              Thao tác này không thể hoàn tác
            </p>
            <p className="text-sm text-red-700">
              Bạn có chắc chắn muốn xóa ảnh &quot;{image.title || image.name}
              &quot;?
            </p>
          </div>

          {/* Image Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên:</span>
              <span className="font-medium text-gray-900 truncate ml-2">
                {image.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kích thước:</span>
              <span className="font-medium text-gray-900">
                {parseInt(image.size) / 1024 / 1024 < 1
                  ? `${(parseInt(image.size) / 1024).toFixed(2)} KB`
                  : `${(parseInt(image.size) / 1024 / 1024).toFixed(2)} MB`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            {deleting && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {deleting ? "Đang xóa..." : "Xóa ảnh"}
          </button>
        </div>
      </div>
    </div>
  );
};
