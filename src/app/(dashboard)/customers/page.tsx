"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Edit, Trash2, Search as SearchIcon, Loader2, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@components/ui/toaster";
import { useGetApiV10User, useDeleteApiV10UserId } from "@api/endpoints/user";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <main className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý tài khoản</h1>
            <p className="text-sm text-muted-foreground">
              Danh sách người dùng hệ thống
            </p>
          </div>
          <Can I="create" a="users">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tạo tài khoản
            </Button>
          </Can>
        </div>

        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Tìm kiếm"
            placeholder="Tìm theo username hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium">#</th>
                  <th className="h-10 px-4 text-left font-medium">Username</th>
                  <th className="h-10 px-4 text-left font-medium">Email</th>
                  <th className="h-10 px-4 text-left font-medium">Họ & tên</th>
                  <th className="h-10 px-4 text-left font-medium">Trạng thái</th>
                  <th className="h-10 px-4 text-left font-medium">Tạo lúc</th>
                  <th className="h-10 px-4 text-right font-medium">Hành động</th>
                </tr>
              </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="h-32 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={7} className="h-32 text-center text-red-600">
                    Lỗi khi tải dữ liệu
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8" />
                      <p>Không có người dùng</p>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.map((row: Record<string, unknown>, idx: number) => (
                <tr key={getString(row, 'id') || String(idx)} className="border-b transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium">{getString(row, 'username')}</td>
                  <td className="px-4 py-3 text-muted-foreground">{getString(row, 'email')}</td>
                  <td className="px-4 py-3">
                    {[getString(row, 'first_name'), getString(row, 'last_name')].filter(Boolean).join(" ") || '-'}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={getString(row, 'status')} /></td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {getString(row, 'created_at')
                      ? new Date(getString(row, 'created_at')).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {ability.can('update', 'users') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(getString(row, 'id'))}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {ability.can('deactivate', 'users') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(getString(row, 'id'))}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Hiển thị {filtered.length} / {(data?.responseData?.rows ?? []).length} người dùng
        </p>
      </main>

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
