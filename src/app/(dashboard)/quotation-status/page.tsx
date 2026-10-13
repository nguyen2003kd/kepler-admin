"use client";

import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Search, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý Tiêu chuẩn</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý các Tiêu chuẩn trong hệ thống
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={openCreateForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm mới
          </Button>
        </div>

        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium w-16">
                      STT
                    </th>
                    <th className="h-10 px-4 text-left font-medium">
                      Tên Tiêu chuẩn
                    </th>
                    <th className="h-10 px-4 text-left font-medium w-48">
                      Ngày tạo
                    </th>
                    <th className="h-10 px-4 text-right font-medium w-32">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="h-32 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Tag className="h-8 w-8" />
                          <p>
                            {searchQuery
                              ? "Không tìm thấy kết quả phù hợp"
                              : "Chưa có Tiêu chuẩn nào"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditForm(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
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
            </div>

            {/* Stats */}
            <p className="text-xs text-muted-foreground">
              Hiển thị {filteredItems.length} / {items.length} Tiêu chuẩn
            </p>
        </div>

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
      </main>
    </>
  );
}
