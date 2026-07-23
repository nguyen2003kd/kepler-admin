"use client"

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useGetApiV10UserId, usePutApiV10UserId } from "@api/endpoints/user";
import { toast } from "@components/ui/toaster";
import { FallbackSpinner } from "@/components/shared/fallbackspinner";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string | null;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, onSuccess, userId }) => {
  const { data, isLoading, isError } = useGetApiV10UserId(userId ?? '', { query: { enabled: !!userId && isOpen } });
  const mutation = usePutApiV10UserId();

  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    first_name: "", 
    last_name: "" ,
    phone: "",
    status: ""
  });

  useEffect(() => {
    if (data?.responseData) {
      const d = data.responseData as Record<string, unknown>;
      setForm({
        username: String(d.username ?? ''),
        email: String(d.email ?? ''),
        first_name: String(d.first_name ?? ''),
        last_name: String(d.last_name ?? ''),
        phone: String(d.phone ?? ''),
        status: String(d.status ?? '')
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await mutation.mutateAsync({ id: userId, data: form });
      toast.success({ title: 'Cập nhật thành công', content: 'Thông tin người dùng đã được cập nhật.' });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Cập nhật thất bại';
      toast.error({ content: msg });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {(isLoading || mutation.isPending) && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <FallbackSpinner size="md"  />
          </div>
        )}
        
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Chỉnh sửa tài khoản</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isError ? (
          <div className="p-6 text-center text-red-600">
            <p>Không thể tải thông tin người dùng</p>
            <button 
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nhập username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                <input 
                  name="first_name" 
                  value={form.first_name} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nhập họ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                <input 
                  name="last_name" 
                  value={form.last_name} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Nhập tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input 
                  name="phone" 
                  type="tel"
                  value={form.phone} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="VD: 0912345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="pending_verification">Chờ xác minh</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button 
                type="submit" 
                disabled={mutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditModal;