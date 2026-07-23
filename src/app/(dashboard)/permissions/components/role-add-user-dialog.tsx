"use client";

import React, { useState } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Mail,
  User,
  Loader2,
  CheckCircle2,
  X,
  UserMinus,
  Users,
} from 'lucide-react';
import { Role, UserRoleItem } from '../types';
import { useGetApiV10User } from '@/api/endpoints/user';
import {
  useGetApiV10UserRole,
  usePostApiV10UserRole,
  useDeleteApiV10UserRoleId,
} from '@/api/endpoints/user-role';
import type { User as ApiUser } from '@/api/models';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface RoleAddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  roles?: Role[]; // all roles — for displaying role names
  onSuccess?: () => void;
}

export function RoleAddUserDialog({
  open,
  onOpenChange,
  role,
  roles = [],
  onSuccess,
}: RoleAddUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  // --- Fetch all users (for search to add) ---
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetApiV10User({
    pageSize: 200,
  });

  // --- Fetch users already assigned to this role ---
  const {
    data: assignedResponse,
    isLoading: isLoadingAssigned,
    refetch: refetchAssigned,
  } = useGetApiV10UserRole(
    role?.id ? { filters: `role_id==${role.id}`, pageSize: 200 } : undefined,
    {
      query: { enabled: !!role?.id && open },
    }
  );

  // --- Fetch ALL userRole assignments to show existing roles per user ---
  const { data: allUserRolesResponse } = useGetApiV10UserRole(
    { pageSize: 500 },
    { query: { enabled: open } }
  );

  const { mutate: assignRole, isPending: isAssigning } = usePostApiV10UserRole();
  const { mutate: removeAssignment, isPending: isRemoving } =
    useDeleteApiV10UserRoleId();

  const allUsers: ApiUser[] = usersResponse?.responseData?.rows || [];
  const assignedUserRoles: UserRoleItem[] =
    (assignedResponse?.responseData?.rows ?? []) as unknown as UserRoleItem[];
  const allUserRoles: UserRoleItem[] =
    (allUserRolesResponse?.responseData?.rows ?? []) as unknown as UserRoleItem[];

  // Build map: userId -> list of role names
  const userRoleNamesMap = new Map<string, string[]>();
  allUserRoles.forEach((ur) => {
    const roleName = roles.find((r) => r.id === ur.role_id)?.name ?? ur.role?.name ?? ur.role_id;
    const prev = userRoleNamesMap.get(ur.user_id) ?? [];
    userRoleNamesMap.set(ur.user_id, [...prev, roleName]);
  });

  // IDs of already-assigned users (to hide from add list)
  const assignedUserIds = new Set(assignedUserRoles.map((ur) => ur.user_id));

  /* ── helpers ── */
  const getDisplayName = (u: ApiUser | UserRoleItem['user']) => {
    const first = 'first_name' in u ? u.first_name : undefined;
    const last = 'last_name' in u ? u.last_name : undefined;
    const email = 'email' in u ? u.email : '';
    if (first && last) return `${last} ${first}`;
    if (first) return first;
    if (last) return last;
    const username = 'username' in u ? (u as ApiUser).username : undefined;
    if (username) return username;
    return email?.split('@')[0] || 'Unknown';
  };

  const getInitials = (u: ApiUser | UserRoleItem['user']) => {
    const first = 'first_name' in u ? u.first_name : undefined;
    const last = 'last_name' in u ? u.last_name : undefined;
    if (first && last) return `${last[0]}${first[0]}`.toUpperCase();
    return getDisplayName(u).substring(0, 2).toUpperCase();
  };

  const filteredUsers = allUsers.filter((u) => {
    if (assignedUserIds.has(u.id ?? '')) return false; // already assigned
    const fullName = `${u.last_name || ''} ${u.first_name || ''}`.trim();
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      fullName.toLowerCase().includes(q)
    );
  });

  const handleClose = () => {
    setSearch('');
    setSelectedUser(null);
    onOpenChange(false);
  };

  /* ── add user ── */
  const handleAddUser = () => {
    if (!selectedUser?.id || !role?.id) return;

    assignRole(
      { data: { user_id: selectedUser.id, role_id: role.id, is_primary: true } },
      {
        onSuccess: () => {
          toast({
            title: 'Thành công',
            description: `Đã thêm ${getDisplayName(selectedUser)} vào vai trò "${role.name}"`,
          });
          setSelectedUser(null);
          setSearch('');
          refetchAssigned();
          queryClient.invalidateQueries({ queryKey: ['/api/v1.0/userRole'] });
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const msg =
            error instanceof Error
              ? error.message
              : 'Người dùng này đã có vai trò khác';
          toast({ title: 'Lỗi', description: msg, variant: 'destructive' });
        },
      }
    );
  };

  /* ── remove user ── */
  const handleRemoveUser = (userRoleId: string, displayName: string) => {
    removeAssignment(
      { id: userRoleId },
      {
        onSuccess: () => {
          toast({
            title: 'Đã xóa',
            description: `Đã xóa ${displayName} khỏi vai trò "${role?.name}"`,
          });
          refetchAssigned();
          queryClient.invalidateQueries({ queryKey: ['/api/v1.0/userRole'] });
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const msg =
            error instanceof Error ? error.message : 'Không thể xóa người dùng khỏi vai trò';
          toast({ title: 'Lỗi', description: msg, variant: 'destructive' });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quản lý người dùng — <span className="text-primary">{role?.name}</span>
          </DialogTitle>
          <DialogDescription>
            Xem danh sách và thêm / xóa người dùng trong vai trò này
          </DialogDescription>
        </DialogHeader>

        {/* ── 2-column layout ── */}
        <div className="grid grid-cols-2 gap-0 py-1 divide-x divide-border">

          {/* ── Left: Assigned users ── */}
          <div className="space-y-2 pr-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Đã được gán</p>
              {isLoadingAssigned ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Badge variant="secondary">{assignedUserRoles.length} người</Badge>
              )}
            </div>

            <div className="min-h-[280px] max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {isLoadingAssigned ? (
                <div className="flex items-center justify-center h-full py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : assignedUserRoles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
                  <Users className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Chưa có người dùng nào</p>
                </div>
              ) : (
                assignedUserRoles.map((ur) => {
                  const name = getDisplayName(ur.user);
                  return (
                    <div
                      key={ur.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-muted/30"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(ur.user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ur.user.email}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                        title="Xóa khỏi vai trò"
                        onClick={() => handleRemoveUser(ur.id, name)}
                        disabled={isRemoving}
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right: Add user ── */}
          <div className="space-y-2 pl-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Thêm người dùng</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="min-h-[240px] max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center h-full py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
                  <User className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">
                    {search
                      ? 'Không tìm thấy người dùng'
                      : assignedUserIds.size > 0
                      ? 'Tất cả đã được thêm'
                      : 'Không có người dùng nào'}
                  </p>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedUser?.id === u.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(u)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-sm font-medium truncate">
                        <User className="h-3 w-3 text-muted-foreground shrink-0" />
                        {getDisplayName(u)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate mt-0.5">
                        <Mail className="h-3 w-3 shrink-0" />
                        {u.email}
                      </div>
                      {/* Role badges */}
                      {(userRoleNamesMap.get(u.id ?? '') ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(userRoleNamesMap.get(u.id ?? '') ?? []).map((rName) => (
                            <Badge
                              key={rName}
                              variant="secondary"
                              className="h-4 text-[10px] px-1.5 py-0 leading-none"
                            >
                              {rName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedUser?.id === u.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isAssigning}>
            <X className="h-4 w-4 mr-2" />
            Đóng
          </Button>
          <Button
            onClick={handleAddUser}
            disabled={!selectedUser || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Thêm vào vai trò
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
