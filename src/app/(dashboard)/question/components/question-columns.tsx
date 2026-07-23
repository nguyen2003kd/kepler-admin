"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Question } from "@/api/models/question"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react"

interface QuestionColumnsProps {
  onView: (item: Question) => void
  onEdit: (item: Question) => void
  onDelete: (id: string) => void
  deletingId: string | null
  canDelete: boolean
  canEdit: boolean
}

export const createQuestionColumns = ({
  onView,
  onEdit,
  onDelete,
  deletingId,
  canDelete,
  canEdit,
}: QuestionColumnsProps): ColumnDef<Question>[] => [
  {
    accessorKey: "name",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">{row.original.name ?? "—"}</div>
    ),
  },
  {
    accessorKey: "phone_number",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.phone_number ?? "—"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.email ?? "—"}</span>
    ),
  },
  {
    accessorKey: "major",
    header: "Chuyên môn",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.major ?? "—"}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.original.created_at
      if (!date) return <span className="text-gray-400">—</span>
      return (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(row.original)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>

          {canEdit && (
            <DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(row.original.id!)}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deletingId === row.original.id}
            >
              <Trash className="mr-2 h-4 w-4" />
              {deletingId === row.original.id ? "Đang xóa..." : "Xóa"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
