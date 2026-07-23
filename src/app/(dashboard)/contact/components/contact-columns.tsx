"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Mail, Phone, User, Calendar, Eye } from "lucide-react";
import { useAbility } from "@/hooks/use-ability";
import type { Contact } from "@/types";

interface UseContactColumnsProps {
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function useContactColumns({
  onView,
  onEdit,
  onDelete,
}: UseContactColumnsProps): ColumnDef<Contact>[] {
  const ability = useAbility();
  
  return React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone_number",
        header: "Điện thoại",
        cell: ({ row }) =>
          row.original.phone_number ? (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{row.original.phone_number}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">--</span>
          ),
      },
      {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.original.content ? (
              <span title={row.original.content}>{row.original.content}</span>
            ) : (
              <span className="text-muted-foreground">--</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {row.original.created_at
                ? new Date(row.original.created_at).toLocaleDateString("vi-VN")
                : "--"}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {ability.can('view_detail', 'contact') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(row.original)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {ability.can('update', 'contact') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {ability.can('delete', 'contact') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa liên hệ &ldquo;{row.original.name}
                      &rdquo;? Hành động này không thể hoàn tác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(row.original.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete, ability]
  );
}
