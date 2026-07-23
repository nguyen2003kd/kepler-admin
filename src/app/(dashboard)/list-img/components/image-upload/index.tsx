"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePostApiV10File,
  getGetApiV10FileQueryKey,
} from "@/api/endpoints/file";
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'
import { Upload, X } from "lucide-react";
import type { FileUpload } from "@/api/models";
import Can from '@/acl/Can';
export const ImageUpload: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const postMutation = usePostApiV10File();
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    note: "",
    is_in_library: true,
  });

  const uploading = postMutation.isPending;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const imageMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/apng",
      "image/bmp",
      "image/tiff",
      "image/avif",
      "image/heic",
      "image/heif",
    ];
    const imageExts = /\.(jpg|jpeg|png|gif|webp|svg|apng|bmp|tiff|avif|heic|heif)$/i;

    if (file.size > maxSize) {
      return `File "${file.name}" vượt quá 10MB`;
    }

    const isImageMime = imageMimes.includes(file.type);
    const isImageExt = imageExts.test(file.name);

    if (!isImageMime && !isImageExt) {
      return `File "${file.name}" không phải định dạng ảnh hợp lệ`;
    }

    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile);
    if (error) {
      toast.error({ title: 'Lỗi', content: error });
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    setShowForm(true);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const uploadData: FileUpload = {
        file,
        type: 'image',
        title: formData.title || file.name,
        description: formData.description || undefined,
        note: formData.note || undefined,
        // is_in_library: formData.is_in_library,
        is_in_library: true,
      };
      await postMutation.mutateAsync({ data: uploadData });
      await queryClient.invalidateQueries({
        queryKey: getGetApiV10FileQueryKey(),
      });
      resetForm();
      toast.success({ title: 'Tải lên thành công', content: 'Ảnh đã được tải lên.' })
      onSuccess?.();
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      const msg = extractErrorMessage(err)
      toast.error({ title: 'Tải thất bại', content: msg })
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFile(null);
    setPreview("");
    setFormData({ title: "", description: "", note: "", is_in_library: true });
  };

  return (
    <>
      {!showForm ? (
          <Can I="upload" a="gallery">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          <Upload className="h-4 w-4" /> Tải ảnh lên
        </button>
        </Can>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
              <Can I="upload" a="gallery">
              <h3 className="text-xl font-bold">Tải ảnh lên</h3>
              <button
                onClick={resetForm}
                disabled={uploading}
                className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
                </Can>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* File Selection */}
              {!file ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Kéo thả ảnh vào đây
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    hoặc nhấp để chọn từ máy tính
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/apng,image/bmp,image/tiff,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.gif,.webp,.svg,.apng,.bmp,.tiff,.avif,.heic,.heif"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={uploading}
                    />
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer font-medium text-sm">
                      Chọn ảnh
                    </span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                    <button
                      onClick={() => setFile(null)}
                      disabled={uploading}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Nhập tiêu đề ảnh"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Nhập mô tả ảnh (không bắt buộc)"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        disabled={uploading}
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
                        placeholder="Nhập ghi chú (không bắt buộc)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                    </div>

                    {/* <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_in_library"
                        checked={formData.is_in_library}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_in_library: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="is_in_library"
                        className="text-sm text-gray-700 font-medium cursor-pointer"
                      >
                        Hiện hình ảnh
                      </label>
                    </div> */}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
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
                {uploading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                )}
                {uploading ? "Đang tải..." : "Tải lên"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
