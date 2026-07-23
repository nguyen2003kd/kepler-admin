"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePutApiV10FileId,
  getGetApiV10FileQueryKey,
} from "@/api/endpoints/file";
import { X, Upload } from "lucide-react";
import type { ImageFile } from "@/types/list-img";
import type { FileUpdate } from "@/api/models";
import Image from "next/image";
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import baseConfig from "@configs/base";
export const ImageEdit: React.FC<{
  image: ImageFile;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ image, onClose, onSuccess }) => {
  const queryClient = useQueryClient();
  const putMutation = usePutApiV10FileId();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: image.title || "",
    description: image.description || "",
    note: image.note || "",
    is_in_library: image.is_in_library,
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const saving = putMutation.isPending;

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const videoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];

    if (file.size > maxSize) {
      return `File "${file.name}" vượt quá 10MB`;
    }
    if (
      videoTypes.includes(file.type) ||
      file.name.match(/\.(mp4|webm|ogg|avi|mov|mkv)$/i)
    ) {
      return `File "${file.name}" là video, không được phép`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error({ title: 'Lỗi', content: error });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, file });
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, file: null });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      const updateData: FileUpdate & { file?: File } = {
        title: formData.title && formData.title.trim() ? formData.title : null,
        description:
          formData.description && formData.description.trim()
            ? formData.description
            : null,
        note: formData.note && formData.note.trim() ? formData.note : null,
        is_in_library: formData.is_in_library,
      };
      if (formData.file) {
        updateData.file = formData.file;
      }
      console.log("Updating with data:", updateData);
      await putMutation.mutateAsync({
        id: image.id,
        data: updateData as FileUpdate,
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiV10FileQueryKey(),
      });
      onSuccess();
      toast.success({ title: 'Cập nhật thành công', content: 'Ảnh đã được cập nhật.' })
      onClose();
    } catch (err: unknown) {
      console.error("Update failed:", err);
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Cập nhật thất bại', content: msg })
    }
  };

  return (
    <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className=" flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold">Chỉnh sửa ảnh</h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Preview */}
          <div className="space-y-2">
            <div className="bg-gray-100 rounded-lg overflow-auto aspect-video flex items-center justify-center max-h-64 relative group">
              {/* <img
                src={previewUrl || image.compress_info?.tablet || image.path}
                alt={image.title || image.name}
                className="max-w-full max-h-full object-contain"
              /> */}

              <Image
                src={
                  previewUrl
                    ? previewUrl
                    : `${baseConfig.imgEndpointDomain}${
                        image.compress_info?.desktop ||
                        image.compress_info?.tablet ||
                        image.compress_info?.mobile ||
                        image.path
                      }`
                }
                alt={image.title || image.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-white" />
                  <span className="text-sm text-white font-medium">
                    Đổi ảnh
                  </span>
                </div>
              </button>
            </div>
            {formData.file && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {formData.file.name}
                    </p>
                    <p className="text-xs text-blue-700">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
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
              accept="image/*"
              onChange={handleFileChange}
              disabled={saving}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tiêu đề ảnh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả ảnh"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="Nhập ghi chú"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_in_library"
                checked={formData.is_in_library}
                onChange={(e) =>
                  setFormData({ ...formData, is_in_library: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
              <label
                htmlFor="is_in_library"
                className="text-sm text-gray-700 font-medium cursor-pointer"
              >
                Hiện hình ảnh
              </label>
            </div>
          </div>

          {/* Image Info */}
          {/* <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên file:</span>
              <span className="font-medium text-gray-900">{image.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kích thước:</span>
              <span className="font-medium text-gray-900">
                {parseInt(image.size) / 1024 / 1024 < 1
                  ? `${(parseInt(image.size) / 1024).toFixed(2)} KB`
                  : `${(parseInt(image.size) / 1024 / 1024).toFixed(2)} MB`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Loại:</span>
              <span className="font-medium text-gray-900">{image.mime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tạo lúc:</span>
              <span className="font-medium text-gray-900">
                {new Date(image.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div> */}
        </div>

        {/* Footer */}
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
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            )}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};
