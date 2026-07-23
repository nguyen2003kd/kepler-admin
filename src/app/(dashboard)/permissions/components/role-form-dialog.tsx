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
import { Save, X, Loader2 } from 'lucide-react';
import { PermissionMatrix } from './permission-matrix';
import { Role, ModulePermission } from '../types';
import { useBackendPermissions } from '../hooks/use-permissions';
import { buildModulesFromPermissions } from '../lib/permission-adapter';

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSave: (role: Role) => void;
}

export function RoleFormDialog({ open, onOpenChange, role, onSave }: RoleFormDialogProps) {
  const { data: backendPermissions, isLoading: isLoadingPermissions } = useBackendPermissions();
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [availableModules, setAvailableModules] = useState<ModulePermission[]>([]);

  // Build available modules from backend permissions (fine-grained actions)
  useEffect(() => {
    if (backendPermissions && backendPermissions.length > 0) {
      const modules = buildModulesFromPermissions(backendPermissions);
      setAvailableModules(modules);
    }
  }, [backendPermissions]);

  // Initialize form khi dialog mở
  useEffect(() => {
    if (!open || availableModules.length === 0) return;

    if (role) {
      setFormData({ name: role.name, description: role.description });

      // Merge: availableModules làm template, overlay quyền từ role
      const merged = availableModules.map(availableModule => {
        const roleModule = role.permissions.find(p => p.id === availableModule.id);
        if (!roleModule) {
          // Module này role chưa có → tất cả false
          const permissions: Record<string, boolean> = {};
          availableModule.availableActions.forEach(a => { permissions[a] = false; });
          return { ...availableModule, permissions };
        }
        // Merge: prefer roleModule's values, fallback false cho action mới
        const permissions: Record<string, boolean> = {};
        availableModule.availableActions.forEach(a => {
          permissions[a] = !!roleModule.permissions[a];
        });
        return { ...availableModule, permissions };
      });

      setPermissions(merged);
    } else {
      setFormData({ name: '', description: '' });
      // Tất cả false
      setPermissions(availableModules.map(m => {
        const permissions: Record<string, boolean> = {};
        m.availableActions.forEach(a => { permissions[a] = false; });
        return { ...m, permissions };
      }));
    }
  }, [role, open, availableModules]);

  // Handler: action là string động (view_detail, update, delete, v.v.)
  const handlePermissionChange = (moduleId: string, action: string, value: boolean) => {
    setPermissions(prev => prev.map(module => {
      if (module.id !== moduleId) return module;
      return {
        ...module,
        permissions: { ...module.permissions, [action]: value },
      };
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const newRole: Role = {
      id: role?.id || `role-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      permissions,
      createdAt: role?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: role?.isSystem || false,
    };

    onSave(newRole);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}</DialogTitle>
          <DialogDescription>
            {role
              ? 'Cập nhật thông tin và phân quyền cho vai trò'
              : 'Tạo vai trò mới và thiết lập phân quyền chi tiết'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoadingPermissions && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải danh sách quyền...</span>
            </div>
          )}

          {!isLoadingPermissions && (
            <>
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">
                    Tên vai trò <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    placeholder="Ví dụ: Quản lý nội dung"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-desc">Mô tả</Label>
                  <Input
                    id="role-desc"
                    placeholder="Mô tả ngắn về vai trò"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Ma trận phân quyền fine-grained */}
              <PermissionMatrix
                modules={permissions}
                onPermissionChange={handlePermissionChange}
                filterByAbility={false}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name.trim() || isLoadingPermissions}
          >
            <Save className="h-4 w-4 mr-2" />
            {role ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
