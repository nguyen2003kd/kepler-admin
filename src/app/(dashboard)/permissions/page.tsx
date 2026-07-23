"use client";

import React from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { RoleManagement } from './components';
import { useRoles } from './hooks/use-permissions';
import { toast } from 'sonner';

export default function PermissionsPage() {
  const { roles, isLoading, refetch, error } = useRoles();

  const handleRefresh = async () => {
    await refetch();
    toast.success('Đã làm mới dữ liệu');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Quản lý phân quyền" />
        <div className="p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Quản lý phân quyền" />
        <div className="p-6 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Lỗi tải dữ liệu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Không thể tải dữ liệu vai trò'}
              </p>
              <Button onClick={() => refetch()} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Quản lý phân quyền" />

      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Thiết lập và quản lý quyền truy cập cho người dùng
          </p>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="p-6 pt-3">
        <RoleManagement roles={roles} />
      </div>
    </div>
  );
}
