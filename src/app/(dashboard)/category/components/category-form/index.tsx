"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/shared/lucide-icon-picker";
import { Plus, Edit } from "lucide-react";
import type { CategoryFormProps } from "@/types/category";
import { generateCategoryLink } from "@/utils/slug";

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isEditing,
  editingCategory,
  values,
  categories, // eslint-disable-line @typescript-eslint/no-unused-vars
  saving,
  onValuesChange,
  onSave,
  onCancel,
}) => {
  const handleChange = (
    field: keyof CategoryFormProps["values"],
    value: string,
  ) => {
    // Auto-generate link when name changes
    if (field === "name") {
      const autoLink = generateCategoryLink(value);
      onValuesChange((prev) => ({ ...prev, name: value, link: autoLink }));
    } else {
      onValuesChange((prev) => ({ ...prev, [field]: value }));
    }
  };

  // const handleToggle = (
  //   field: keyof CategoryFormProps["values"],
  //   value: boolean
  // ) => {
  //   onValuesChange((prev) => ({ ...prev, [field]: value }));
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <Edit className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          {isEditing
            ? `Chỉnh sửa danh mục: ${editingCategory?.name}`
            : values.parent_category_id
              ? "Tạo danh mục con"
              : "Tạo danh mục mới"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Cập nhật thông tin danh mục"
            : values.parent_category_id
              ? "Thêm danh mục con vào danh mục đã chọn"
              : "Nhập thông tin để tạo danh mục mới"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Tên danh mục *
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên danh mục"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          {/* Icon URL */}
          <div>
            <label className="text-sm font-medium block mb-1">Icon</label>
            <IconPicker
              value={values.icon_url}
              onChange={(iconName) =>
                onValuesChange((prev) => ({ ...prev, icon_url: iconName }))
              }
            />
          </div>
          {/* <div>
						<label className="text-sm font-medium block mb-1">Mã danh mục</label>
						<input 
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
							placeholder="VD: CAT001" 
							value={values.code} 
							onChange={(e) => handleChange('code', e.target.value)}
						/>
						<small className="text-gray-500 text-xs mt-1 block">Để trống nếu không cần mã danh mục</small>
					</div> */}
          <div>
            <label className="text-sm font-medium block mb-1">
              Vị trí sắp xếp
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1, 2, 3..."
              type="number"
              min="0"
              value={values.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </div>

          {/* Parent Category Selection */}
          {/* {(!isEditing || !values.parent_category_id) && (
						<div>
							<label className="text-sm font-medium block mb-1">Danh mục cha</label>
							<select 
								className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
								value={values.parent_category_id}
								onChange={(e) => handleChange('parent_category_id', e.target.value)}
							>
								<option value="">{isEditing ? "-- Không có danh mục cha --" : "-- Chọn danh mục cha (tùy chọn) --"}</option>
								{categories
									.filter(cat => isEditing ? cat.id !== editingCategory?.id : true)
									.map(cat => (
										<option key={cat.id} value={cat.id}>{cat.name}</option>
									))}
							</select>
						</div>
					)} */}

          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium block mb-1">Liên kết</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com hoặc /path"
              value={values.link}
              onChange={(e) => handleChange("link", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium block mb-1">Mô tả</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả chi tiết về danh mục"
              rows={3}
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          {/* Is Service Switch */}
          <div className="md:col-span-2 lg:col-span-3">
            {/* <label className="text-sm font-medium block mb-1">Là dịch vụ</label>
            <div className="flex items-center gap-2 mt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={Boolean(values.is_service)} 
                  onChange={(e) => handleToggle('is_service', e.target.checked)} 
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm w-full inline-block">Đánh dấu là dịch vụ</span>
            </div> */}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            className={
              isEditing
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }
            onClick={onSave}
            disabled={saving || !values.name.trim()}
          >
            {saving
              ? "Đang lưu..."
              : isEditing
                ? "Cập nhật danh mục"
                : "Lưu danh mục"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
