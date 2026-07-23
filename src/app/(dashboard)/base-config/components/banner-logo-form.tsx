"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePickerFile } from "@/components/shared/image-picker";
import { getImageUrl } from "../utils";

interface BannerLogoFormProps {
  mode: "banner" | "logo";
  isEditing: boolean;
  formData: {
    name: string;
    img_url: string;
    is_active: boolean;
  };
  onFormChange: (data: {
    name: string;
    img_url: string;
    is_active: boolean;
  }) => void;
  selectedImageFile: ImagePickerFile | null;
  globalDisplayTime: string;
  onOpenImagePicker: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function BannerLogoForm({
  mode,
  isEditing,
  formData,
  onFormChange,
  selectedImageFile,
  globalDisplayTime,
  onOpenImagePicker,
  onSubmit,
  onCancel,
}: BannerLogoFormProps) {
  const label = mode === "banner" ? "Banner" : "Logo";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">
              {isEditing ? `Chỉnh sửa ${label}` : `Thêm ${label} mới`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Điền thông tin {label.toLowerCase()}
            </p>
          </div>
          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label className="text-sm font-medium">Tên *</label>
              <Input
                placeholder={`Nhập tên ${label.toLowerCase()}`}
                value={formData.name}
                onChange={(e) =>
                  onFormChange({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Image URL field */}
            <div>
              <label className="text-sm font-medium">Link</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.img_url}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    img_url: e.target.value,
                  })
                }
              />
            </div>

            {/* Display Time field - Read Only */}
            <div>
              <label className="text-sm font-medium">
                Thời gian hiển thị (giây)
              </label>
              <Input
                type="number"
                value={globalDisplayTime}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Image selection */}
            <div>
              <label className="text-sm font-medium">Hình ảnh từ thư viện</label>
              {(selectedImageFile || formData.img_url) ? (
                <div className="mt-2 space-y-2">
                  <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.img_url || getImageUrl(selectedImageFile)}
                      alt="Selected image"
                      className={`w-full h-full ${
                        mode === "logo"
                          ? "object-contain bg-gray-50"
                          : "object-cover"
                      }`}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={onOpenImagePicker}
                    className="w-full"
                  >
                    Thay đổi hình ảnh
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={onOpenImagePicker}
                  className="w-full mt-1"
                >
                  Chọn hình ảnh
                </Button>
              )}
            </div>

            {/* Active toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${mode}Active`}
                checked={formData.is_active}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    is_active: e.target.checked,
                  })
                }
              />
              <label htmlFor={`${mode}Active`} className="text-sm font-medium">
                Hiển thị
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onCancel}>
                Hủy
              </Button>
              <Button onClick={onSubmit}>
                {isEditing ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
