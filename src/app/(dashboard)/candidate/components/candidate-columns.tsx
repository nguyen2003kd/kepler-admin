"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Candidate } from "@/api/models/candidate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import Can from "@/acl/Can"
interface CandidateColumnsProps {
  onView: (candidate: Candidate) => void
  onEdit: (candidate: Candidate) => void
  onDelete: (id: string) => void
  deletingId: string | null
  canDelete: boolean
  canEdit: boolean
}

function renderStatus(status?: string | null) {
  if (!status) return <span className="text-gray-400">—</span>

  const normalized = status.trim().toLowerCase()

  const { label, className } =
    normalized === "pending"
      ? {
          label: "Đang xử lý",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        }
      : normalized === "accepted" || normalized === "approved"
      ? {
          label: "Chấp nhận",
          className: "bg-green-50 text-green-700 border-green-200",
        }
      : normalized === "reject" || normalized === "rejected"
      ? {
          label: "Từ chối",
          className: "bg-red-50 text-red-600 border-red-200",
        }
      : {
          label: status,
          className: "bg-gray-50 text-gray-600 border-gray-200",
        }

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}

export const createCandidateColumns = ({
  onView,
  onEdit,
  onDelete,
  deletingId,
  canDelete,
  canEdit,
}: CandidateColumnsProps): ColumnDef<Candidate>[] => [
  {
    accessorKey: "full_name",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.full_name ?? "—"}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Vị trí tuyển dụng",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.position ?? "—"}</span>
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
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.phone ?? "—"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => renderStatus(row.original.status),
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
          <Can I="view_detail" a="candidate">
            <DropdownMenuItem
              onClick={() => onView(row.original)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
          </Can>

          {canEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
              className="cursor-pointer"
            >
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
