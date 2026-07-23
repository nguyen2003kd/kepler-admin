"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Eye, Settings } from 'lucide-react';
import { Role } from '../types';

interface RoleTemplatesProps {
  roles: Role[]; // Use real roles from API instead of hardcoded
  onSelectRole: (roleId: string) => void;
}

export function RoleTemplates({ roles, onSelectRole }: RoleTemplatesProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Filter to show only system roles or pre-defined templates
  const templateRoles = roles.filter(r => r.isSystem || roles.length <= 5);

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return <Settings className="h-5 w-5" />;
      case 'editor':
        return <Users className="h-5 w-5" />;
      case 'viewer':
        return <Eye className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'admin':
        return 'bg-red-500/10 text-red-500 border-red-200';
      case 'editor':
        return 'bg-blue-500/10 text-blue-500 border-blue-200';
      case 'viewer':
        return 'bg-green-500/10 text-green-500 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mẫu phân quyền</CardTitle>
        <CardDescription>
          Chọn mẫu phân quyền có sẵn để áp dụng nhanh
        </CardDescription>
      </CardHeader>
      <CardContent>
        {templateRoles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Chưa có vai trò mẫu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templateRoles.map((role) => (
              <div
                key={role.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:shadow-sm'
                }`}
                onClick={() => {
                  setSelectedRole(role.id);
                  onSelectRole(role.id);
                }}
              >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getRoleColor(role.id)}`}>
                  {getRoleIcon(role.id)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{role.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions?.slice(0, 3).map((perm) => (
                      <Badge key={perm.id} variant="outline" className="text-xs">
                        {perm.name}
                      </Badge>
                    ))}
                    {role.permissions && role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedRole === role.id && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>💡 Mẹo:</strong> Chọn mẫu phân quyền để tự động thiết lập quyền phù hợp với vai trò. Bạn vẫn có thể tùy chỉnh sau.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
