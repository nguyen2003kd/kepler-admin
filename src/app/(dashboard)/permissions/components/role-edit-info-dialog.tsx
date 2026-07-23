"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { Role } from '../types';

interface RoleEditInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSave: (role: Role) => void;
  isSaving?: boolean;
}

export function RoleEditInfoDialog({
  open,
  onOpenChange,
  role,
  onSave,
  isSaving = false,
}: RoleEditInfoDialogProps) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (open && role) {
      setFormData({ name: role.name, description: role.description });
    }
  }, [open, role]);

  const handleSave = () => {
    if (!formData.name.trim() || !role) return;
    onSave({
      ...role,
      name: formData.name.trim(),
      description: formData.description.trim(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin vai trò</DialogTitle>
          <DialogDescription>
            Cập nhật tên và mô tả cho vai trò này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role-name">
              Tên vai trò <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-role-name"
              placeholder="Ví dụ: Quản lý nội dung"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role-desc">Mô tả</Label>
            <Textarea
              id="edit-role-desc"
              placeholder="Mô tả ngắn về vai trò này..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={isSaving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim() || isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
