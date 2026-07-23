"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { Download, Loader2 } from "lucide-react"
import { Header } from "@/components/layout/header"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmModal, useConfirmModal } from "@/components/shared/confirm-modal"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toaster"
import { extractErrorMessage } from "@/utils/error"
import { mainInstance } from "@/api/mutator/custom-instance"
import Can from "@/acl/Can"
import type { Candidate } from "@/api/models/candidate"
import type { CandidateMutate } from "@/api/models/candidateMutate"
import type { GetApiV10CandidateParams } from "@/api/models"
import {
  useDeleteApiV10CandidateId,
  usePutApiV10CandidateId,
} from "@/api/endpoints/candidate"
import { useAbility } from "@/hooks/use-ability";
import { CandidateEdit } from "../recruitment/components"
import { CandidateDetail, createCandidateColumns } from "./components"

const PAGE_SIZE = 20

// API response type
interface CandidateApiResponse {
  message?: string
  responseData?: {
    count?: number
    page?: number
    pageSize?: number
    rows?: Candidate[]
  }
  count?: number
  page?: number
  pageSize?: number
  rows?: Candidate[]
  status?: string
}

// Fetch function for infinite query
const fetchCandidatePage = async ({
  pageParam,
  filters,
}: {
  pageParam: number
  filters?: string
}): Promise<CandidateApiResponse> => {
  const params: GetApiV10CandidateParams = {
    page: pageParam,
    pageSize: PAGE_SIZE,
    sortField: "created_at",
    sortOrder: "desc",
    ...(filters ? { filters } : {}),
  }
  return mainInstance<CandidateApiResponse>({
    url: "/api/v1.0/candidate",
    method: "GET",
    params,
  })
}

const Page: React.FC = () => {
  const queryClient = useQueryClient()
  const { confirm } = useConfirmModal()
  const [search, setSearch] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  // Build filters from search
  const filters = useMemo(() => {
    const q = search.trim()
    return q ? `(full_name|email|phone)@=${q}` : undefined
  }, [search])

  // Infinite query
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["candidate-infinite", filters],
    queryFn: ({ pageParam }) => fetchCandidatePage({ pageParam: pageParam as number, filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const total = lastPage?.responseData?.count ?? lastPage?.count ?? 0
      const currentPage = lastPage?.responseData?.page ?? 1
      const loaded = currentPage * PAGE_SIZE
      return loaded < total ? currentPage + 1 : undefined
    },
  })

  // Flatten all pages into candidates array
  const candidates: Candidate[] = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => {
      const pageData = page?.responseData ?? page
      const rows = pageData?.rows
      return Array.isArray(rows) ? rows : []
    })
  }, [data])

  const updateCandidateMutation = usePutApiV10CandidateId()
  const deleteCandidateMutation = useDeleteApiV10CandidateId()

  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [candidateEditOpen, setCandidateEditOpen] = useState(false)
  const [candidateDeletingId, setCandidateDeletingId] = useState<string | null>(null)

  const isTableLoading = isLoading

  const canEdit = useAbility().can('edit', 'candidate')
  const canDelete = useAbility().can('delete', 'candidate')

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["candidate-infinite"],
    })
  }

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

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

      setCandidateDeletingId(id)
      try {
        await deleteCandidateMutation.mutateAsync({ id })
        toast.success({
          title: "Thành công",
          content: "Đã xóa ứng viên thành công",
        })
        queryClient.invalidateQueries({
          queryKey: ["candidate-infinite"],
        })
      } catch (error) {
        const msg = extractErrorMessage(error)
        toast.error({ title: "Xóa thất bại", content: msg })
      } finally {
        setCandidateDeletingId(null)
      }
    },
    [confirm, deleteCandidateMutation, queryClient]
  )

  const handleCandidateUpdate = async (id: string, data: CandidateMutate) => {
    try {
      await updateCandidateMutation.mutateAsync({ id, data })
      toast.success({
        title: "Thành công",
        content: "Đã cập nhật ứng viên thành công",
      })
      queryClient.invalidateQueries({
        queryKey: ["candidate-infinite"],
      })
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error({ title: "Cập nhật thất bại", content: msg })
      throw error
    }
  }

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const params: GetApiV10CandidateParams = {
        page: 1,
        pageSize: 10000,
        ...(filters ? { filters } : {}),
      }

      const response = await mainInstance<Blob>({
        url: "/api/v1.0/candidate/export",
        method: "GET",
        params,
        responseType: "blob",
      })

      const blob = response instanceof Blob
        ? response
        : new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })

      const fileName = `candidates_${Date.now()}.xlsx`
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)

      toast.success({
        title: "Xuất file thành công",
        content: "Đã tải xuống danh sách ứng viên",
      })
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error({ title: "Xuất file thất bại", content: msg })
    } finally {
      setIsExporting(false)
    }
  }, [filters])

  const columns = useMemo(
    () =>
      createCandidateColumns({
        onView: handleCandidateView,
        onEdit: handleCandidateEdit,
        onDelete: handleCandidateDelete,
        deletingId: candidateDeletingId,
        canDelete,
        canEdit,
      }),
    [handleCandidateView, handleCandidateEdit, handleCandidateDelete, candidateDeletingId, canDelete, canEdit]
  )

  return (
    <>
      <Header title="Ứng viên" />
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Ứng viên</h2>
          <Can I="export_excel" a="candidate">
            <Button onClick={handleExport} disabled={isExporting} className="gap-2">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Xuất Excel
            </Button>
          </Can>
        </div>
        <div>
          <p className="text-muted-foreground">Quản lý danh sách ứng viên</p>
        </div>

        <DataTable
          columns={columns}
          data={candidates}
          searchPlaceholder="Tìm kiếm ứng viên..."
          isLoading={isTableLoading}
          onSearch={setSearch}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      <CandidateDetail
        candidate={viewingCandidate}
        open={Boolean(viewingCandidate)}
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
