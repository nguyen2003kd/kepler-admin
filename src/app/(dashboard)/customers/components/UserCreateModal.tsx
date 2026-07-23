"use client"

import React, { useState } from "react";
import { X } from "lucide-react";
import { usePostApiV10User } from "@api/endpoints/user";
import { toast } from "@components/ui/toaster";
import { FallbackSpinner } from "@/components/shared/fallbackspinner";
import CryptoJS from "crypto-js";
interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const mutation = usePostApiV10User();

  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    first_name: "", 
    last_name: "", 
    phone: "",
    password: "" 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const encryptedPassword = CryptoJS.SHA256(form.password).toString()
      const payload = { ...form, phone: form.phone || undefined, password: encryptedPassword };
      await mutation.mutateAsync({ data: payload });
      toast.success({ title: 'Tạo thành công', content: 'Người dùng đã được tạo.' });
      setForm({ username: "", email: "", first_name: "", last_name: "", phone: "", password: "" });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Tạo thất bại';
      toast.error({ content: msg });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {mutation.isPending && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <FallbackSpinner size="md" />
          </div>
        )}
        
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Tạo tài khoản mới</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ *</label>
              <input 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange} 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nhập họ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên *</label>
              <input 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange} 
                required
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
                <span className="ml-1 text-xs text-gray-400 font-normal">(tùy chọn, tối thiểu 6 ký tự)</span>
              </label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Để trống nếu chưa cần đặt mật khẩu"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
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
      </div>
    </div>
  );
};

export default UserCreateModal;