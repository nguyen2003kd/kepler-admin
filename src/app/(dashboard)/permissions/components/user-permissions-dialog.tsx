"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Shield, User, Mail, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { ModulePermission, Role } from '../types';
import { PermissionMatrix } from './permission-matrix';
import { useBackendPermissions } from '../hooks/use-permissions';
import { buildModulesFromPermissions } from '../lib/permission-adapter';
import { useGetApiV10User } from '@/api/endpoints/user';
import { usePostApiV10UserRole, useGetApiV10UserRoleId, usePutApiV10UserRoleId } from '@/api/endpoints/user-role';
import type { User as ApiUser } from '@/api/models';
import { useToast } from '@/components/ui/use-toast';

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[]; // Danh sách roles có sẵn
  selectedUserRoleId?: string | null; // ID của userRole record (để edit)
}

export function UserPermissionsDialog({ open, onOpenChange, roles, selectedUserRoleId }: UserPermissionsDialogProps) {
  const { toast } = useToast();
  const { data: backendPermissions } = useBackendPermissions();
  
  // State declarations
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<ModulePermission[]>([]);
  const [hasCustomPermissions, setHasCustomPermissions] = useState(false);
  const [availableModules, setAvailableModules] = useState<ModulePermission[]>([]);
  const [editingUserRoleId, setEditingUserRoleId] = useState<string | null>(null);
  
  // Fetch users from API
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetApiV10User({
    pageSize: 100, // Get all users
  });
  
  // Fetch existing userRole when editing
  const { data: existingUserRole, isLoading: isLoadingUserRole } = useGetApiV10UserRoleId(
    selectedUserRoleId || '',
    {
      query: {
        enabled: !!selectedUserRoleId && open,
      },
    }
  );
  
  // Mutation for assigning role to user (CREATE)
  const { mutate: assignRole, isPending: isAssigningRole } = usePostApiV10UserRole();
  
  // Mutation for updating user role (UPDATE)
  const { mutate: updateRole, isPending: isUpdatingRole } = usePutApiV10UserRoleId();
  
  // Build available modules from backend permissions
  useEffect(() => {
    if (backendPermissions && backendPermissions.length > 0) {
      const modules = buildModulesFromPermissions(backendPermissions);
      setAvailableModules(modules);
      setUserPermissions(modules.map(m => ({ ...m, permissions: { ...m.permissions } })));
    }
  }, [backendPermissions]);

  // Get users list from API response
  const users: ApiUser[] = usersResponse?.responseData?.rows || [];
  
  // Load existing userRole data when editing
  useEffect(() => {
    if (existingUserRole?.responseData && open) {
      const userRoleData = existingUserRole.responseData;
      
      // Set editing mode
      if (userRoleData.id) {
        setEditingUserRoleId(userRoleData.id);
      }
      
      // Find and set the user
      const user = users.find(u => u.id === userRoleData.user_id);
      if (user) {
        setSelectedUser(user);
      }
      
      // Set the role
      if (userRoleData.role_id) {
        setSelectedRoleId(userRoleData.role_id);
      }
    } else if (!selectedUserRoleId) {
      // Reset when creating new
      setEditingUserRoleId(null);
    }
  }, [existingUserRole, open, selectedUserRoleId, users]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setSelectedRoleId('');
      setSearchUser('');
      setEditingUserRoleId(null);
      setHasCustomPermissions(false);
    }
  }, [open]);
  
  // Khi chọn user, load role và permissions của họ
  useEffect(() => {
    if (selectedUser) {
      // Reset role selection when user changes
      setSelectedRoleId('');
      setHasCustomPermissions(false);
    }
  }, [selectedUser]);

  // Khi thay đổi role, áp dụng permissions của role mới
  useEffect(() => {
    if (selectedRoleId) {
      // Find the role from props (which already has permissions loaded)
      const selectedRole = roles.find(r => r.id === selectedRoleId);
      
      if (selectedRole?.permissions) {
        console.log('Using permissions from role:', selectedRoleId, selectedRole.permissions);
        setUserPermissions(selectedRole.permissions.map(p => ({
          ...p,
          permissions: { ...p.permissions }
        })));
        setHasCustomPermissions(false);
      } else if (availableModules.length > 0) {
        // Fallback to empty permissions if role not found
        console.log('Role not found or has no permissions, using empty modules');
        setUserPermissions(resetPermissions(availableModules));
        setHasCustomPermissions(false);
      }
    } else if (!selectedRoleId && availableModules.length > 0) {
      setUserPermissions(resetPermissions(availableModules));
      setHasCustomPermissions(false);
    }
  }, [selectedRoleId, roles, availableModules]);

  const resetPermissions = (modules: ModulePermission[]) =>
    modules.map(m => {
      const permissions: Record<string, boolean> = {};
      m.availableActions.forEach(a => { permissions[a] = false; });
      return { ...m, permissions };
    });

  const handleRoleChange = (roleId: string) => {
    // Reset permissions khi đổi role
    if (availableModules.length > 0) {
      setUserPermissions(resetPermissions(availableModules));
    }
    setSelectedRoleId(roleId);
    setHasCustomPermissions(false);
    // Permissions will be loaded by the useEffect above
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.last_name || ''} ${user.first_name || ''}`.trim();
    const searchLower = searchUser.toLowerCase();
    return (
      (user.email?.toLowerCase().includes(searchLower)) ||
      (user.username?.toLowerCase().includes(searchLower)) ||
      fullName.toLowerCase().includes(searchLower)
    );
  });
  
  const getUserDisplayName = (user: ApiUser) => {
    if (user.first_name && user.last_name) {
      return `${user.last_name} ${user.first_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    if (user.username) return user.username;
    return user.email?.split('@')[0] || 'Unknown';
  };
  
  const getUserInitials = (user: ApiUser) => {
    if (user.first_name && user.last_name) {
      return `${user.last_name[0]}${user.first_name[0]}`.toUpperCase();
    }
    const displayName = getUserDisplayName(user);
    return displayName.substring(0, 2).toUpperCase();
  };

  // action là string động từ API (view_detail, update, delete, create_post_info, v.v.)
  const handlePermissionChange = (moduleId: string, action: string, value: boolean) => {
    setUserPermissions(prev => prev.map(module => {
      if (module.id !== moduleId) return module;
      return {
        ...module,
        permissions: { ...module.permissions, [action]: value },
      };
    }));
    setHasCustomPermissions(true);
  };

  const handleSave = () => {
    if (!selectedUser?.id || !selectedRoleId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn người dùng và vai trò',
        variant: 'destructive',
      });
      return;
    }

    const userRoleData = {
      user_id: selectedUser.id,
      role_id: selectedRoleId,
      is_primary: true,
    };

    // Check if editing or creating
    if (editingUserRoleId) {
      // UPDATE existing user role
      updateRole(
        {
          id: editingUserRoleId,
          data: userRoleData,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Thành công',
              description: `Đã cập nhật vai trò cho ${getUserDisplayName(selectedUser)}`,
            });
            onOpenChange(false);
          },
          onError: (error: unknown) => {
            const msg = error instanceof Error ? error.message : 'Không thể cập nhật vai trò cho người dùng';
            toast({
              title: 'Lỗi',
              description: msg,
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      // CREATE new user role assignment
      assignRole(
        {
          data: userRoleData,
        },
        {
          onSuccess: () => {
            toast({
              title: 'Thành công',
              description: `Đã gán vai trò cho ${getUserDisplayName(selectedUser)}`,
            });
            onOpenChange(false);
          },
          onError: (error: unknown) => {
            const msg = error instanceof Error ? error.message : 'Không thể gán vai trò cho người dùng';
            toast({
              title: 'Lỗi',
              description: msg,
              variant: 'destructive',
            });
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingUserRoleId ? 'Chỉnh sửa phân quyền' : 'Phân quyền cho người dùng'}
          </DialogTitle>
          <DialogDescription>
            {editingUserRoleId 
              ? 'Cập nhật vai trò và quyền truy cập của người dùng'
              : 'Chọn người dùng và thiết lập quyền truy cập của họ'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Danh sách người dùng */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingUserRoleId ? 'Người dùng' : 'Chọn người dùng'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!editingUserRoleId && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                )}

                {isLoadingUserRole ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                  </div>
                ) : editingUserRoleId && selectedUser ? (
                  <div className="p-3 rounded-lg border border-primary bg-primary/5">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getUserInitials(selectedUser)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="font-medium text-sm truncate">{getUserDisplayName(selectedUser)}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {searchUser ? 'Không tìm thấy người dùng' : 'Không có người dùng nào'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedUser?.id === user.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <p className="font-medium text-sm truncate">{getUserDisplayName(user)}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ma trận phân quyền */}
          <div className="md:col-span-2">
            {selectedUser ? (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(selectedUser)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{getUserDisplayName(selectedUser)}</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      </div>
                    </div>

                    {/* Chọn vai trò */}
                    <div className="space-y-2">
                      <Label htmlFor="role-select">Vai trò</Label>
                      <Select value={selectedRoleId} onValueChange={handleRoleChange}>
                        <SelectTrigger id="role-select">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span>{role.name}</span>
                                {role.isSystem && (
                                  <Badge variant="secondary" className="text-xs ml-2">Hệ thống</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedRoleId && (
                        <p className="text-xs text-muted-foreground">
                          {roles.find(r => r.id === selectedRoleId)?.description}
                        </p>
                      )}
                    </div>

                    {/* Cảnh báo custom permissions */}
                    {hasCustomPermissions && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Phân quyền tùy chỉnh
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">
                            Người dùng này có phân quyền khác với vai trò mặc định
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Ma trận phân quyền */}
                {selectedRoleId ? (
                  <PermissionMatrix
                    modules={userPermissions}
                    onPermissionChange={handlePermissionChange}
                    filterByAbility={false}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Shield className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-sm">Chọn vai trò để xem quyền</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)} 
                    disabled={isAssigningRole || isUpdatingRole}
                  >
                    Hủy
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={!selectedRoleId || isAssigningRole || isUpdatingRole}
                  >
                    {(isAssigningRole || isUpdatingRole) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {editingUserRoleId ? 'Cập nhật phân quyền' : 'Lưu phân quyền'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent>
                  <div className="text-center text-muted-foreground">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>Chọn người dùng để thiết lập quyền</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
