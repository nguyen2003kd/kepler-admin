'use client'

import React, { useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  getApiV10Post,
  useGetApiV10PostIdApprovalHistories,
  usePostApiV10PostIdResult,
} from '@/api/endpoints/post'
import type { PostStatus as PostStatusType } from '@/api/models'
import { toast } from '@/components/ui/toaster'
import { useAbility } from '@/hooks/use-ability'
import { extractErrorMessage } from '@/utils/error'
import {
  type ApprovalPost,
  type ApprovalHistoryItem,
  type ApprovalTabKey,
  L2_STATUS_MAP,
} from '@/types/post-approval'

const PAGE_SIZE = 10

export interface UseApprovalL2Return {
  // State
  searchQ: string
  setSearchQ: (q: string) => void
  activeTab: ApprovalTabKey
  setActiveTab: (tab: ApprovalTabKey) => void
  resultDialogOpen: boolean
  setResultDialogOpen: (open: boolean) => void
  historyDialogOpen: boolean
  setHistoryDialogOpen: (open: boolean) => void
  activePost: ApprovalPost | null
  setActivePost: (post: ApprovalPost | null) => void
  submitStatus: 'PUBLISHED' | 'REJECTED' | null
  setSubmitStatus: (status: 'PUBLISHED' | 'REJECTED' | null) => void
  note: string
  setNote: (note: string) => void

  // Data
  posts: ApprovalPost[]
  totalCount: number
  isLoading: boolean
  refetch: () => Promise<unknown>
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean

  // History
  historyQuery: ReturnType<typeof useGetApiV10PostIdApprovalHistories>
  approvalHistories: ApprovalHistoryItem[]

  // Permissions
  canApprovePost: boolean
  canViewPost: boolean
  canViewHistory: boolean

  // Mutations
  resultMutation: ReturnType<typeof usePostApiV10PostIdResult>

  // Actions
  openResultDialog: (post: ApprovalPost, status: 'PUBLISHED' | 'REJECTED') => void
  handleOpenHistoryDialog: () => void
  handleSubmitResult: () => Promise<void>
  clearActivePost: () => void
}

export function useApprovalL2(): UseApprovalL2Return {
  const ability = useAbility()
  const [searchQ, setSearchQ] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<ApprovalTabKey>('pending')
  const [resultDialogOpen, setResultDialogOpen] = React.useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = React.useState(false)
  const [activePost, setActivePost] = React.useState<ApprovalPost | null>(null)
  const [submitStatus, setSubmitStatus] = React.useState<'PUBLISHED' | 'REJECTED' | null>(null)
  const [note, setNote] = React.useState('')

  const canApprovePost =
    ability.can('approve_post', 'post-approval-2') || ability.can('approve_post', 'news')
  const canViewPost = ability.can('view_post', 'post-approval-2')
  const canViewHistory =
    ability.can('view_history', 'post-approval-2') || ability.can('view_history', 'news')

  const currentStatus = L2_STATUS_MAP[activeTab]

  // Fetch posts
  const {
    data: infiniteData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['post-approval-l2', activeTab, searchQ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const trimmed = searchQ.trim()
      const statusFilter = `status==${currentStatus}`
      const filters = trimmed
        ? `(Title|summary|code)@=${encodeURI(trimmed)},${statusFilter}`
        : statusFilter

      const response = await getApiV10Post(
        {
          page: pageParam,
          pageSize: PAGE_SIZE,
          sortOrder: 'desc',
          filters,
          filterBy: 'ADMIN',
        },
        signal,
      )

      if (response.status !== 'success') {
        throw new Error(response.message || 'Không lấy được danh sách bài viết')
      }

      const responseData = (response as {
        responseData?: {
          rows?: Array<Record<string, unknown>>
          count?: number
          page?: number
          pageSize?: number
        }
      }).responseData || {}

      const rows = Array.isArray(responseData.rows) ? responseData.rows : []
      const normalizedRows: ApprovalPost[] = rows
        .filter(item => item.id && String(item.id) !== '[id]')
        .map((item) => ({
          id: String(item.id),
          title: String(item.title || ''),
          code: String(item.code || ''),
          status: (item.status as PostStatusType) || null,
          created_at: String(item.created_at || ''),
        }))

      return {
        page: responseData.page ?? Number(pageParam),
        pageSize: responseData.pageSize ?? PAGE_SIZE,
        count: typeof responseData.count === 'number' ? responseData.count : 0,
        rows: normalizedRows,
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const p = lastPage.page ?? 1
      const ps = lastPage.pageSize ?? PAGE_SIZE
      const total = lastPage.count ?? 0
      const totalPages = ps > 0 ? Math.ceil(total / ps) : undefined
      return totalPages && p < totalPages ? p + 1 : undefined
    },
    staleTime: 60_000,
  })

  const posts: ApprovalPost[] = React.useMemo(() => {
    if (!infiniteData?.pages) return [] as ApprovalPost[]
    return infiniteData.pages.flatMap((page) => page.rows || [])
  }, [infiniteData])

  const totalCount = React.useMemo(() => {
    return infiniteData?.pages?.[0]?.count ?? 0
  }, [infiniteData])

  // History query
  const historyQuery = useGetApiV10PostIdApprovalHistories(
    activePost?.id || '',
    {
      page: 1,
      pageSize: 100,
      sortField: 'created_at',
      sortOrder: 'desc',
    },
    {
      query: {
        enabled: historyDialogOpen && !!activePost?.id,
      },
    },
  )

  const approvalHistories: ApprovalHistoryItem[] = React.useMemo(() => {
    const rows =
      (
        historyQuery.data as {
          responseData?: { rows?: Array<Record<string, unknown>> }
        } | undefined
      )?.responseData?.rows || []

    if (!Array.isArray(rows)) return [] as ApprovalHistoryItem[]

    return rows.map((item) => ({
      id: String(item.id || ''),
      approval_level: Number(item.approval_level || 0),
      action: String(item.action || ''),
      note: (item.note as string | null) || null,
      created_at: String(item.created_at || ''),
    }))
  }, [historyQuery.data])

  const resultMutation = usePostApiV10PostIdResult()

  const openResultDialog = useCallback(
    (post: ApprovalPost, status: 'PUBLISHED' | 'REJECTED') => {
      if (!canApprovePost) {
        toast.error({
          title: 'Không có quyền',
          content: 'Bạn không có quyền duyệt hoặc từ chối bài viết',
        })
        return
      }

      setActivePost(post)
      setSubmitStatus(status)
      setNote('')
      setResultDialogOpen(true)
    },
    [canApprovePost],
  )

  const handleOpenHistoryDialog = useCallback(() => {
    if (!canViewHistory) {
      toast.error({
        title: 'Không có quyền',
        content: 'Bạn không có quyền xem lịch sử duyệt',
      })
      return
    }

    setHistoryDialogOpen(true)
  }, [canViewHistory])

  const clearActivePost = useCallback(() => {
    setActivePost(null)
  }, [])

  const handleSubmitResult = useCallback(async () => {
    if (!activePost || !submitStatus) return
    if (!canApprovePost) {
      toast.error({
        title: 'Không có quyền',
        content: 'Bạn không có quyền duyệt hoặc từ chối bài viết',
      })
      return
    }

    try {
      await resultMutation.mutateAsync({
        id: activePost.id,
        data: {
          status: submitStatus,
          note: note.trim() || null,
        },
      })

      toast.success({
        title: 'Thành công',
        content:
          submitStatus === 'REJECTED'
            ? 'Đã từ chối bài viết'
            : 'Đã xuất bản bài viết',
      })

      setResultDialogOpen(false)
      await refetch()
    } catch (error) {
      toast.error({
        title: 'Thao tác thất bại',
        content: extractErrorMessage(error),
      })
    }
  }, [activePost, submitStatus, note, canApprovePost, resultMutation, refetch])

  return {
    searchQ, setSearchQ,
    activeTab, setActiveTab,
    resultDialogOpen, setResultDialogOpen,
    historyDialogOpen, setHistoryDialogOpen,
    activePost, setActivePost,
    submitStatus, setSubmitStatus,
    note, setNote,
    posts, totalCount, isLoading,
    refetch, fetchNextPage, hasNextPage, isFetchingNextPage,
    historyQuery, approvalHistories,
    canApprovePost, canViewPost, canViewHistory,
    resultMutation,
    openResultDialog, handleOpenHistoryDialog, handleSubmitResult, clearActivePost,
  }
}
