"use client"

import type { Recruitment } from "@/api/models/recruitment"
import type { Candidate } from "@/api/models/candidate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  Edit,
  Trash,
  ChevronDown,
  ChevronUp,
  Users,
  Loader2,
  Eye,
} from "lucide-react"
import { useState } from "react"
import { useGetApiV10Candidate } from "@/api/endpoints/candidate"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAbility } from '@/hooks/use-ability';
import Can from '@/acl/Can';

// ─── Expandable Row Renderer ─────────────────────────────────────────────────

interface ExpandableRowProps {
  recruitment: Recruitment
  onEdit: (r: Recruitment) => void
  onDelete: (id: string) => void
  onCandidateView: (c: Candidate) => void
  onCandidateEdit: (c: Candidate) => void
  onCandidateDelete: (id: string) => void
  deletingId: string | null
  canDelete: boolean
  canEdit: boolean
}

type CandidateListResponse = {
  responseData?: {
    rows?: Candidate[]
  }
}

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  recruitment,
  onEdit,
  onDelete,
  onCandidateView,
  onCandidateEdit,
  onCandidateDelete,
  deletingId,
  canDelete,
  canEdit,
}) => {
  const [expanded, setExpanded] = useState(false)

  const { data: candidatesData, isLoading: candidatesLoading } =
    useGetApiV10Candidate<CandidateListResponse>(
      { filters: `recruitment_id==${recruitment.id}` },
      { query: { enabled: expanded } }
    )

  const candidates: Candidate[] = candidatesData?.responseData?.rows ?? []
  const ability = useAbility();
  return (
    <>
      {/* ── Main row ── */}
      <TableRow className="group">
        {/* Expand toggle */}
        <TableCell className="w-12 px-2">
          {ability.can("view_detail", "candidate")||ability.can("edit", "candidate")||ability.can("delete", "candidate") ? (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              aria-label={expanded ? "Thu gọn" : "Mở rộng"}          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
) : null}
        </TableCell>

        {/* Data cells */}
        <TableCell className="font-medium text-gray-900">
          {recruitment.title ?? "—"}
        </TableCell>
        <TableCell className="text-gray-600">
          {recruitment.location ?? "—"}
        </TableCell>
        {/* <TableCell className="text-gray-600">
          {recruitment.experience ?? "—"}
        </TableCell>
        <TableCell className="text-gray-600">
          {recruitment.employment_type ?? "—"}
        </TableCell> */}
        <TableCell className="text-gray-600">
          {(() => {
            const min = recruitment.salary_min
            const max = recruitment.salary_max
            if (!min && !max) return "—"
            const fmt = (v: string | null | undefined) =>
              v
                ? Number(v).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  })
                : null
            const minStr = fmt(min)
            const maxStr = fmt(max)
            if (minStr && maxStr) return `${minStr} – ${maxStr}`
            if (minStr) return `Từ ${minStr}`
            return `Đến ${maxStr}`
          })()}
        </TableCell>
        <TableCell className="text-gray-600">
          {recruitment.quantity ?? "—"}
        </TableCell>
        <TableCell className="text-gray-600">
          {recruitment.deadline
            ? new Date(recruitment.deadline).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={
              recruitment.is_active
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }
          >
            {recruitment.is_active ? "Đang tuyển" : "Đã hủy"}
          </Badge>
        </TableCell>
        <TableCell className="text-gray-600">
          {recruitment.created_at
            ? new Date(recruitment.created_at).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "—"}
        </TableCell>

        {/* Actions */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(recruitment)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(recruitment.id!)}
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deletingId === recruitment.id}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {deletingId === recruitment.id ? "Đang xóa..." : "Xóa"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* ── Nested candidate table ── */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={11} className="p-0 bg-sky-50/30 border-t-0">
            <div className="px-4 pb-4">
              <div className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2 mt-3 px-1">
                Danh sách ứng viên
              </div>
              <div className="rounded-lg border border-sky-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-teal-500 to-cyan-600 border-0">
                      <TableHead className="text-white font-semibold text-xs py-3 px-4 w-12">STT</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Họ và tên</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Địa chỉ</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Số điện thoại</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Email</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Trình độ học vấn</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Chuyên môn</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Ngoại ngữ</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Tin học</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4">Trạng thái</TableHead>
                      <TableHead className="text-white font-semibold text-xs py-3 px-4 w-12">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidatesLoading ? (
                      <TableRow>
                        <TableCell colSpan={11} className="h-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                            <span className="text-gray-500 text-sm">Đang tải ứng viên...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : candidates.length > 0 ? (
                      candidates.map((c, i) => (
                        <TableRow
                          key={c.id ?? i}
                          className="hover:bg-cyan-50/40 transition-colors bg-white even:bg-sky-50/10"
                        >
                          <TableCell className="text-gray-500 text-sm py-3 px-4">{i + 1}</TableCell>
                          <TableCell className="font-medium text-gray-800 py-3 px-4">
                            {c.full_name ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.address ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.phone ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.email ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.education_level ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.major ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.language_proficiency ?? "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm py-3 px-4">
                            {c.it_proficiency ?? "—"}
                          </TableCell>
                          <TableCell className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                c.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : c.status === "approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }
                            >
                              {c.status === "pending"
                                ? "Chờ duyệt"
                                : c.status === "approved"
                                ? "Đã duyệt"
                                : c.status ?? "—"}
                            </Badge>
                          </TableCell>
                          {/* Actions */}
                          <TableCell className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-7 w-7 p-0 hover:bg-gray-100"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Can I="view_detail" a="candidate">
                                  <DropdownMenuItem
                                    onClick={() => onCandidateView(c)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                </Can>
                                <Can I="edit" a="candidate">
                                  <DropdownMenuItem
                                    onClick={() => onCandidateEdit(c)}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                </Can>
                                <Can I="delete" a="candidate">
                                  <DropdownMenuItem
                                    onClick={() => c.id && onCandidateDelete(c.id)}
                                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={deletingId === c.id}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    {deletingId === c.id ? "Đang xóa..." : "Xóa"}
                                  </DropdownMenuItem>
                                </Can>  
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                     : (
                      <TableRow>
                        <TableCell colSpan={11} className="h-16 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                            <Users className="w-8 h-8 opacity-40" />
                            <span className="text-sm">Không có dữ liệu</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
