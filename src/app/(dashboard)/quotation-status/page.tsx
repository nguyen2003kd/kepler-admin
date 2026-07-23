"use client";

import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";

// API imports
import {
  useGetApiV10Calibration,
  usePostApiV10Calibration,
  usePutApiV10CalibrationId,
  useDeleteApiV10CalibrationId,
} from "@/api/endpoints/calibration";
import type { Calibration } from "@/api/models/calibration";
import type { CalibrationMutate } from "@/api/models/calibrationMutate";

export default function CalibrationPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Calibration | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CalibrationMutate>({
    name: "",
  });

  // API hooks
  const {
    data: calibrationData,
    isLoading,
    refetch,
  } = useGetApiV10Calibration();
  const createMutation = usePostApiV10Calibration();
  const updateMutation = usePutApiV10CalibrationId();
  const deleteMutation = useDeleteApiV10CalibrationId();

  const items = (calibrationData?.responseData?.rows ?? []) as Calibration[];

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  // Form handlers
  const resetForm = () => {
    setFormData({ name: "" });
    setEditingItem(null);
  };

  const openCreateForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (item: Calibration) => {
    setEditingItem(item);
    setFormData({ name: item.name || "" });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast.error("Vui lòng nhập tên Tiêu chuẩn");
      return;
    }

    try {
      if (editingItem?.id) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: formData,
        });
        toast.success("Cập nhật Tiêu chuẩn thành công");
      } else {
        await createMutation.mutateAsync({ data: formData });
        toast.success("Tạo Tiêu chuẩn mới thành công");
      }
      setFormOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        editingItem ? "Lỗi khi cập nhật Tiêu chuẩn" : "Lỗi khi tạo Tiêu chuẩn",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Tiêu chuẩn này?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Xóa Tiêu chuẩn thành công");
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Lỗi khi xóa Tiêu chuẩn");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header title="Quản lý loại mẫu" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Tag className="text-cyan-600" />
                  Quản lý Tiêu chuẩn
                </CardTitle>
                <CardDescription className="text-base">
                  Quản lý các Tiêu chuẩn trong hệ thống
                </CardDescription>
              </div>
              <Button
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={openCreateForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm mới
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                      STT
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tên Tiêu chuẩn
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">
                      Ngày tạo
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600" />
                        </div>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "Không tìm thấy kết quả phù hợp"
                          : "Chưa có Tiêu chuẩn nào"}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => openEditForm(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => item.id && handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-500">
              Hiển thị {filteredItems.length} / {items.length} Tiêu chuẩn
            </div>
          </CardContent>
        </Card>

        {/* Form Modal */}
        {formOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-lg font-semibold">
                    {editingItem ? "Chỉnh sửa Tiêu chuẩn" : "Thêm Tiêu chuẩn mới"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Điền thông tin Tiêu chuẩn
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Tên Tiêu chuẩn <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Nhập tên Tiêu chuẩn..."
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormOpen(false);
                        resetForm();
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Đang xử lý..."
                        : editingItem
                          ? "Cập nhật"
                          : "Tạo mới"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
