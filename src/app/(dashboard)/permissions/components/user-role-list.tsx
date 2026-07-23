"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Edit, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { Role, UserRoleItem } from '../types';
import { useGetApiV10UserRole } from '@/api/endpoints/user-role';
import { useCanAddUserToRole } from '../hooks/use-ability-filter';

interface UserRoleListProps {
  roles: Role[];
  onEditUser: (userId: string) => void;
}

export function UserRoleList({ roles, onEditUser }: UserRoleListProps) {
  // Check if user can assign roles
  const canAddUserToRole = useCanAddUserToRole();
  
  // Fetch user roles from API
  const { data: userRolesResponse, isLoading, error } = useGetApiV10UserRole({
    pageSize: 100, // Get all user roles (adjust as needed)
  });

  const getRoleById = (roleId: string) => {
    return roles.find(r => r.id === roleId);
  };

  const getFullName = (user: UserRoleItem['user']) => {
    if (user.first_name && user.last_name) {
      return `${user.last_name} ${user.first_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.email.split('@')[0]; // Fallback to email username
  };

  const getInitials = (user: UserRoleItem['user']) => {
    if (user.first_name && user.last_name) {
      return `${user.last_name[0]}${user.first_name[0]}`.toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Get user roles from API response
  const userRoles: UserRoleItem[] = (userRolesResponse?.responseData?.rows ?? []) as unknown as UserRoleItem[];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Quản lý vai trò của người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Quản lý vai trò của người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-destructive">
            Không thể tải danh sách người dùng
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">

      {/* Danh sách người dùng */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>
            Quản lý vai trò của người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Vai trò</TableHead>
                  <TableHead className="text-center w-[150px]">Trạng thái</TableHead>
                  <TableHead className="text-right w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Không có người dùng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  userRoles.map((userRole) => {
                    const role = getRoleById(userRole.role_id);
                    const fullName = getFullName(userRole.user);
                    const initials = getInitials(userRole.user);
                    
                    return (
                      <TableRow key={userRole.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <UserIcon className="h-3 w-3 text-muted-foreground" />
                                {fullName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {userRole.user_id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {userRole.user.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={role?.isSystem ? "default" : "secondary"}
                            className="gap-1"
                          >
                            <Shield className="h-3 w-3" />
                            {userRole.role.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {userRole.is_primary ? (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              Chính
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600 border-gray-300">
                              Phụ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canAddUserToRole && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditUser(userRole.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Chú thích */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-300">
                  Chính
                </Badge>
                <span className="text-muted-foreground">Vai trò chính của người dùng</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-gray-600 border-gray-300">
                  Phụ
                </Badge>
                <span className="text-muted-foreground">Vai trò phụ</span>
              </div>
            </div>
            {userRolesResponse?.responseData?.count && (
              <div className="text-sm text-muted-foreground">
                Tổng số: {userRolesResponse.responseData.count} người dùng
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
