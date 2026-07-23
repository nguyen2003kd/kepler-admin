"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, PenLine, KeyRound, UserPlus, Trash2, Shield, Users } from 'lucide-react';
import { RoleFormDialog } from './role-form-dialog';
import { RoleEditInfoDialog } from './role-edit-info-dialog';
import { RoleEditPermissionsDialog } from './role-edit-permissions-dialog';
import { RoleAddUserDialog } from './role-add-user-dialog';
import { Role } from '../types';
import { useUpdateRoleInfo, useSaveRole, useDeleteRole } from '../hooks/use-permissions';
import {
  useCanCreateRole,
  useCanUpdateRole,
  useCanUpdateRolePermission,
  useCanAddUserToRole,
  useCanDeleteRole,
} from '../hooks/use-ability-filter';

interface RoleManagementProps {
  roles: Role[];
}

export function RoleManagement({ roles }: RoleManagementProps) {
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editInfoRole, setEditInfoRole] = useState<Role | null>(null);
  const [editPermsRole, setEditPermsRole] = useState<Role | null>(null);
  const [addUserRole, setAddUserRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const canCreateRole = useCanCreateRole();
  const canUpdateRole = useCanUpdateRole();
  const canUpdateRolePermission = useCanUpdateRolePermission();
  const canAddUserToRole = useCanAddUserToRole();
  const canDeleteRole = useCanDeleteRole();

  const updateRoleInfoMutation = useUpdateRoleInfo();
  const saveRoleMutation = useSaveRole();
  const deleteRoleMutation = useDeleteRole();

  /* ── handlers ── */
  const handleSaveNewRole = (role: Role) => {
    saveRoleMutation.mutate(role, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleSaveInfo = (role: Role) => {
    updateRoleInfoMutation.mutate(
      { id: role.id, name: role.name, description: role.description },
      { onSuccess: () => setEditInfoRole(null) }
    );
  };

  const handleSavePermissions = (role: Role) => {
    saveRoleMutation.mutate(role, {
      onSuccess: () => setEditPermsRole(null),
    });
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete.id);
      setRoleToDelete(null);
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Danh sách vai trò</CardTitle>
            <CardDescription className="mt-1.5">
              Quản lý các vai trò và phân quyền trong hệ thống
            </CardDescription>
          </div>
          {canCreateRole && (
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo vai trò mới
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right w-[200px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 opacity-20" />
                        <p>Chưa có vai trò nào</p>
                        {canCreateRole && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Tạo vai trò đầu tiên
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => {
                    return (
                      <TableRow key={role.id}>
                        {/* Name */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="font-medium">{role.name}</div>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="text-muted-foreground text-sm">
                          {role.description || <span className="italic opacity-50">—</span>}
                        </TableCell>

                        {/* Actions — 4 buttons */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {/* 1. Edit name/description */}
                            {canUpdateRole && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Chỉnh sửa tên & mô tả"
                                onClick={() => setEditInfoRole(role)}
                              >
                                <PenLine className="h-4 w-4" />
                              </Button>
                            )}

                            {/* 2. Edit permissions */}
                            {canUpdateRolePermission && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Chỉnh sửa quyền"
                                onClick={() => setEditPermsRole(role)}
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                            )}

                            {/* 3. Add user to role */}
                            {canAddUserToRole && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Thêm người dùng vào vai trò"
                                onClick={() => setAddUserRole(role)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            )}

                            {/* 4. Delete role */}
                            {canDeleteRole && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Xóa vai trò"
                                onClick={() => setRoleToDelete(role)}
                                disabled={role.isSystem}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer stats */}
          {roles.length > 0 && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Tổng số vai trò:</span>
                <span className="font-semibold text-foreground">{roles.length}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog tạo vai trò mới (full form: name + permissions) */}
      <RoleFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        role={null}
        onSave={handleSaveNewRole}
      />

      {/* Dialog 1: Sửa tên/mô tả */}
      <RoleEditInfoDialog
        open={!!editInfoRole}
        onOpenChange={(open) => { if (!open) setEditInfoRole(null); }}
        role={editInfoRole}
        onSave={handleSaveInfo}
        isSaving={updateRoleInfoMutation.isPending}
      />

      {/* Dialog 2: Sửa quyền */}
      <RoleEditPermissionsDialog
        open={!!editPermsRole}
        onOpenChange={(open) => { if (!open) setEditPermsRole(null); }}
        role={editPermsRole}
        onSave={handleSavePermissions}
        isSaving={saveRoleMutation.isPending}
      />

      {/* Dialog 3: Thêm người dùng vào vai trò */}
      <RoleAddUserDialog
        open={!!addUserRole}
        onOpenChange={(open) => { if (!open) setAddUserRole(null); }}
        role={addUserRole}
        roles={roles}
      />

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vai trò &quot;{roleToDelete?.name}&quot;?{' '}
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
