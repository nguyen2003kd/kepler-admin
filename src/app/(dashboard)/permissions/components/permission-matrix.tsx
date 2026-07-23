"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { ModulePermission } from '../types';
import { getActionLabel } from '../lib/permission-adapter';
import { useAbility } from '@/hooks/use-ability';

interface PermissionMatrixProps {
  modules: ModulePermission[];
  onPermissionChange: (moduleId: string, action: string, value: boolean) => void;
  readOnly?: boolean;
  filterByAbility?: boolean;
}

export function PermissionMatrix({
  modules,
  onPermissionChange,
  readOnly = false,
  filterByAbility = true,
}: PermissionMatrixProps) {
  const ability = useAbility();
  const isSuperAdmin = ability.can('manage', 'all');

  // Filter modules if needed
  const visibleModules = filterByAbility && !isSuperAdmin
    ? modules.filter(module =>
        module.availableActions.some(action =>
          ability.can(action, module.id)
        )
      )
    : modules;

  // Check nếu user có thể toggle một action cụ thể
  const canAssign = (moduleId: string, action: string): boolean => {
    if (isSuperAdmin) return true;
    if (ability.can('update', 'role') || ability.can('manage', 'role')) return true;
    return ability.can(action, moduleId);
  };

  if (visibleModules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ma trận phân quyền</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Không có chức năng nào để hiển thị
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ma trận phân quyền</CardTitle>
        <CardDescription>
          Tick chọn các chức năng cụ thể cho từng module trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {visibleModules.map((module) => (
            <div key={module.id} className="rounded-lg border overflow-hidden">
              {/* Module header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-muted/40 border-b justify-between">
                <div>
                  <div className="font-semibold text-sm">{module.name}</div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </div>
                {/* <Badge variant="outline" className="ml-auto text-xs font-mono">
                     {module.id}      
                </Badge> */}
                {/* Select all toggle */}
                {!readOnly && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Checkbox
                      id={`all-${module.id}`}
                      checked={
                        module.availableActions.length > 0 &&
                        module.availableActions.every(a => module.permissions[a])
                      }
                      onCheckedChange={(checked: boolean) => {
                        module.availableActions.forEach(action => {
                          if (canAssign(module.id, action)) {
                            onPermissionChange(module.id, action, !!checked);
                          }
                        });
                      }}
                      disabled={!module.availableActions.some(a => canAssign(module.id, a))}
                    />
                    <label htmlFor={`all-${module.id}`} className="cursor-pointer select-none">
                      Tất cả
                    </label>
                  </div>
                )}
              </div>

              {/* Actions grid */}
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {module.availableActions.map((action) => {
                  const enabled = !!module.permissions[action];
                  const canEdit = !readOnly && canAssign(module.id, action);

                  return (
                    <label
                      key={action}
                      className={[
                        'flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer select-none transition-colors',
                        enabled
                          ? 'border-primary/40 bg-primary/5 text-primary'
                          : 'border-border bg-background text-muted-foreground',
                        !canEdit && 'opacity-40 cursor-not-allowed',
                        canEdit && 'hover:border-primary/60 hover:bg-primary/10',
                      ].join(' ')}
                    >
                      <Checkbox
                        checked={enabled}
                        onCheckedChange={(checked: boolean) =>
                          canEdit && onPermissionChange(module.id, action, !!checked)
                        }
                        disabled={!canEdit}
                        className="shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-medium leading-tight">
                          {getActionLabel(action)}
                        </div>
                        {/* <div className="truncate text-xs opacity-60 font-mono leading-tight mt-0.5">
                          {action}
                        </div> */}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
