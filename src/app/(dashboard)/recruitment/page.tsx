"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Header } from "@/components/layout/header"
import { ConfirmModal, useConfirmModal } from "@/components/shared/confirm-modal"
import {
  RecruitmentCreate,
  RecruitmentEdit,
  ExpandableRow,
  CandidateDetail,
  CandidateEdit,
} from "./components"
import {
  useGetApiV10Recruitment,
  usePostApiV10Recruitment,
  usePutApiV10RecruitmentId,
  useDeleteApiV10RecruitmentId,
  getGetApiV10RecruitmentQueryKey,
} from "@/api/endpoints/recruitment"
import {
  usePutApiV10CandidateId,
  useDeleteApiV10CandidateId,
  getGetApiV10CandidateQueryKey,
} from "@/api/endpoints/candidate"
import type { Recruitment } from "@/api/models/recruitment"
import type { RecruitmentMutate } from "@/api/models/recruitmentMutate"
import type { Candidate } from "@/api/models/candidate"
import type { CandidateMutate } from "@/api/models/candidateMutate"
import { toast } from "@/components/ui/toaster"
import { extractErrorMessage } from "@/utils/error"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import Can from "@/acl/Can"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAbility } from "@/hooks/use-ability";
type RecruitmentListResponse = {
  responseData?: {
    rows?: Recruitment[]
  }
}

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const { confirm } = useConfirmModal()

  // Data fetching
  const { data: recruitmentData, isLoading } =
    useGetApiV10Recruitment<RecruitmentListResponse>({
      sortField: 'created_at',
      sortOrder: 'desc',
    })

  // Mutations — recruitment
  const createMutation = usePostApiV10Recruitment()
  const updateMutation = usePutApiV10RecruitmentId()
  const deleteMutation = useDeleteApiV10RecruitmentId()

  // Mutations — candidate
  const updateCandidateMutation = usePutApiV10CandidateId()
  const deleteCandidateMutation = useDeleteApiV10CandidateId()

  // UI state — recruitment
  const [createOpen, setCreateOpen] = useState(false)
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")

  // UI state — candidate
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [candidateEditOpen, setCandidateEditOpen] = useState(false)

  // Normalize rows from API response
  const recruitments: Recruitment[] = useMemo(() => {
    const rows = recruitmentData?.responseData?.rows
    if (Array.isArray(rows)) return rows
    return []
  }, [recruitmentData])

  // Filtered data
  const filteredRecruitments = useMemo(() => {
    if (!searchInput.trim()) return recruitments
    const q = searchInput.toLowerCase()
    return recruitments.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q)
    )
  }, [recruitments, searchInput])

  const canDelete = useAbility().can('delete', 'recruitment')
  const canEdit = useAbility().can('edit', 'recruitment')

  // ── Recruitment handlers ─────────────────────────────────────────────────────

  const handleEdit = useCallback(
    (recruitment: Recruitment) => {
      setEditingRecruitment(recruitment)
      setEditOpen(true)
    },
    []
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = await confirm({
        title: "Xác nhận xóa",
        description:
          "Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.",
        confirmText: "Xóa",
        cancelText: "Hủy bỏ",
        variant: "destructive",
      })
      if (!confirmed) return

      setDeletingId(id)
      try {
        await deleteMutation.mutateAsync({ id })
        toast.success({
          title: "Thành công",
          content: "Đã xóa tin tuyển dụng thành công",
        })
        queryClient.invalidateQueries({
          queryKey: getGetApiV10RecruitmentQueryKey(),
        })
      } catch (error) {
        const msg = extractErrorMessage(error)
        toast.error({ title: "Xóa thất bại", content: msg })
      } finally {
        setDeletingId(null)
      }
    },
    [confirm, deleteMutation, queryClient]
  )

  const handleCreate = async (data: RecruitmentMutate) => {
    await createMutation.mutateAsync({ data })
    toast.success({
      title: "Thành công",
      content: "Đã tạo tin tuyển dụng mới thành công",
    })
    queryClient.invalidateQueries({
      queryKey: getGetApiV10RecruitmentQueryKey(),
    })
  }

  const handleUpdate = async (data: RecruitmentMutate) => {
    if (!editingRecruitment?.id) return
    await updateMutation.mutateAsync({ id: editingRecruitment.id, data })
    toast.success({
      title: "Thành công",
      content: "Đã cập nhật tin tuyển dụng thành công",
    })
    queryClient.invalidateQueries({
      queryKey: getGetApiV10RecruitmentQueryKey(),
    })
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: getGetApiV10RecruitmentQueryKey() })
  }

  // ── Candidate handlers ──────────────────────────────────────────────────────

  const handleCandidateView = useCallback((c: Candidate) => {
    setViewingCandidate(c)
  }, [])

  const handleCandidateEdit = useCallback((c: Candidate) => {
    setEditingCandidate(c)
    setCandidateEditOpen(true)
  }, [])

  const handleCandidateDelete = useCallback(
    async (id: string) => {
      const confirmed = await confirm({
        title: "Xác nhận xóa",
        description:
          "Bạn có chắc chắn muốn xóa ứng viên này? Hành động này không thể hoàn tác.",
        confirmText: "Xóa",
        cancelText: "Hủy bỏ",
        variant: "destructive",
      })
      if (!confirmed) return
      try {
        await deleteCandidateMutation.mutateAsync({ id })
        toast.success({
          title: "Thành công",
          content: "Đã xóa ứng viên thành công",
        })
        queryClient.invalidateQueries({
          queryKey: getGetApiV10CandidateQueryKey(),
        })
      } catch (error) {
        const msg = extractErrorMessage(error)
        toast.error({ title: "Xóa thất bại", content: msg })
      }
    },
    [confirm, deleteCandidateMutation, queryClient]
  )

  const handleCandidateUpdate = async (id: string, data: CandidateMutate) => {
    await updateCandidateMutation.mutateAsync({ id, data })
    toast.success({
      title: "Thành công",
      content: "Đã cập nhật ứng viên thành công",
    })
    queryClient.invalidateQueries({
      queryKey: getGetApiV10CandidateQueryKey(),
    })
  }

  return (
    <>
      <Header title="Tin tuyển dụng" />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Quản lý Tin tuyển dụng
            </h2>
            <p className="text-muted-foreground">
              Quản lý danh sách tin tuyển dụng và ứng viên
            </p>
          </div>
          <Can I="create" a="recruitment">
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm tin tuyển dụng
            </Button>
          </Can>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm vị trí, địa điểm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-80 pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all rounded-lg"
              />
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 font-medium whitespace-nowrap"
            >
              {filteredRecruitments.length} dòng
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 gap-2 shadow-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="max-h-[520px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-700 border-0">
                  <TableHead className="w-12 text-white font-semibold tracking-wide py-4 px-3" />
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Vị trí tuyển dụng
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Địa điểm
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Mức lương
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Số lượng
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Hạn nộp
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="text-white font-semibold tracking-wide py-4 px-4">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="text-gray-500 font-medium">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRecruitments.length > 0 ? (
                  filteredRecruitments.map((recruitment, index) => (
                    <ExpandableRow
                      key={recruitment.id ?? index}
                      recruitment={recruitment}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onCandidateView={handleCandidateView}
                      onCandidateEdit={handleCandidateEdit}
                      onCandidateDelete={handleCandidateDelete}
                      deletingId={deletingId}
                      canDelete={canDelete}
                      canEdit={canEdit}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        <span className="text-lg">Không có dữ liệu</span>
                        <span className="text-sm">
                          Thử thay đổi bộ lọc hoặc thêm tin tuyển dụng mới
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modals — recruitment */}
      <RecruitmentCreate
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <RecruitmentEdit
        recruitment={editingRecruitment}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setEditingRecruitment(null)
        }}
        onSubmit={handleUpdate}
      />

      {/* Modals — candidate */}
      <CandidateDetail
        candidate={viewingCandidate}
        open={!!viewingCandidate}
        onClose={() => setViewingCandidate(null)}
      />

      <CandidateEdit
        candidate={editingCandidate}
        open={candidateEditOpen}
        onClose={() => {
          setCandidateEditOpen(false)
          setEditingCandidate(null)
        }}
        onSubmit={handleCandidateUpdate}
      />

      <ConfirmModal />
    </>
  )
}

export default Page
