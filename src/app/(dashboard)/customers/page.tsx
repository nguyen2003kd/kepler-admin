"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@components/ui/toaster";
import { useGetApiV10User, useDeleteApiV10UserId } from "@api/endpoints/user";
import { Header } from "@/components/layout/header";
import { UserCreateModal } from "./components/UserCreateModal";
import { UserEditModal } from "./components/UserEditModal";
import Can from "@/acl/Can";
import { useAbility } from "@/hooks/use-ability";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active: { label: 'Hoạt động', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-600' },
  suspended: { label: 'Tạm khóa', className: 'bg-red-100 text-red-700' },
  pending_verification: { label: 'Chờ xác minh', className: 'bg-yellow-100 text-yellow-700' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_LABEL[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const ability = useAbility();
  const [pageSize] = useState(12)
  const { data, isLoading, isError } = useGetApiV10User(
    {
      page: 1,
      pageSize: pageSize,
      filters: search ? `(email|username|last_name|first_name)@=${encodeURI(search)}` : '',
      sortField: 'created_at',
      sortOrder: 'desc',
    },
  
  );
  const deleteMutation = useDeleteApiV10UserId();

  // Helper to safely get string values from unknown objects
  const getString = useCallback((obj: Record<string, unknown> | undefined, key: string): string => {
    if (!obj) return ''
    const value = obj[key]
    return typeof value === 'string' ? value : String(value ?? '')
  }, []);

  const filtered = useMemo(() => {
    const rows = data?.responseData?.rows ?? [];
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r: Record<string, unknown>) => {
      return (
        getString(r, 'username')
          .toLowerCase()
          .includes(q) ||
        getString(r, 'email')
          .toLowerCase()
          .includes(q) ||
        getString(r, 'first_name')
          .toLowerCase()
          .includes(q) ||
        getString(r, 'last_name')
          .toLowerCase()
          .includes(q)
      );
    });
  }, [data?.responseData?.rows, search, getString]);

  async function handleDelete(id: string) {
    const ok = confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (!ok) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success({ title: 'Xóa thành công', content: 'User đã được xóa.' })
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"] });
    } catch (err: unknown) {
      const errorMsg = err && typeof err === 'object' && 'message' in err && typeof (err as Record<string, unknown>).message === 'string' 
        ? (err as { message: string }).message 
        : "Xóa thất bại"
      toast.error({ content: errorMsg });
    }
  }

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsEditModalOpen(true);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"] });
  };

  return (
    <>
      <Header title="Quản lý tài khoản"/>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Quản lý tài khoản</h1>
            <p className="text-sm text-muted-foreground">
              Danh sách người dùng hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Can I="create" a="users">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tạo tài khoản
              </button>
            </Can>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input
            aria-label="Tìm kiếm"
            placeholder="Tìm theo username hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border rounded-md"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Username</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Họ & tên</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Tạo lúc</th>
                <th className="text-left px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center">
                    Đang tải...
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-red-600"
                  >
                    Lỗi khi tải dữ liệu
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Không có người dùng
                  </td>
                </tr>
              )}

              {filtered.map((row: Record<string, unknown>, idx: number) => (
                <tr key={getString(row, 'id') || String(idx)} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{getString(row, 'username')}</td>
                  <td className="px-4 py-3">{getString(row, 'email')}</td>
                  <td className="px-4 py-3">
                    {[getString(row, 'first_name'), getString(row, 'last_name')].filter(Boolean).join(" ")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={getString(row, 'status')} /></td>
                  <td className="px-4 py-3">
                    {getString(row, 'created_at')
                      ? new Date(getString(row, 'created_at')).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {ability.can('update', 'users') && (
                        <button
                          onClick={() => handleEdit(getString(row, 'id'))}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Sửa
                        </button>
                      )}
                      {ability.can('deactivate', 'users') && (
                        <button
                          onClick={() => handleDelete(getString(row, 'id'))}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                          title="Xóa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
      
      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserId(null);
        }}
        onSuccess={handleModalSuccess}
        userId={selectedUserId}
      />
    </>
  );
}
