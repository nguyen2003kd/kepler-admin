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
import { Save, X, Loader2 } from 'lucide-react';
import { PermissionMatrix } from './permission-matrix';
import { Role, ModulePermission } from '../types';
import { useBackendPermissions, useRolePermissions } from '../hooks/use-permissions';
import { buildModulesFromPermissions } from '../lib/permission-adapter';

interface RoleEditPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSave: (role: Role) => void;
  isSaving?: boolean;
}

export function RoleEditPermissionsDialog({
  open,
  onOpenChange,
  role,
  onSave,
  isSaving = false,
}: RoleEditPermissionsDialogProps) {
  const { data: backendPermissions } = useBackendPermissions();
  const { data: rolePermissions, isLoading: isLoadingPermissions } = useRolePermissions(
    open ? role?.id ?? null : null
  );
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);

  useEffect(() => {
    if (!open || !role || !backendPermissions || backendPermissions.length === 0)
      return;

    const availableModules = buildModulesFromPermissions(backendPermissions);

    // Merge: availableModules làm template, overlay quyền từ role (lazy-loaded)
    const merged = availableModules.map((availableModule) => {
      const roleModule = rolePermissions?.find((p) => p.id === availableModule.id);
      const perms: Record<string, boolean> = {};
      availableModule.availableActions.forEach((a) => {
        perms[a] = roleModule ? !!roleModule.permissions[a] : false;
      });
      return { ...availableModule, permissions: perms };
    });

    setPermissions(merged);
  }, [open, role, backendPermissions, rolePermissions]);

  const handlePermissionChange = (moduleId: string, action: string, value: boolean) => {
    setPermissions((prev) =>
      prev.map((m) =>
        m.id !== moduleId
          ? m
          : { ...m, permissions: { ...m.permissions, [action]: value } }
      )
    );
  };

  const handleSave = () => {
    if (!role) return;
    onSave({
      ...role,
      permissions,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa quyền — {role?.name}</DialogTitle>
          <DialogDescription>
            Thiết lập chi tiết các quyền truy cập cho vai trò này
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingPermissions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải danh sách quyền...</span>
            </div>
          ) : (
            <PermissionMatrix
              modules={permissions}
              onPermissionChange={handlePermissionChange}
              filterByAbility={false}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoadingPermissions}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu quyền
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
