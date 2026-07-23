'use client'

import React, { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import { getApiV10QuotationAll } from '@api/endpoints/quotation'
import { SortOrderParameter } from '@api/models/sortOrderParameter'
import type {
  QuotationTabType,
  QuotationRow,
  QuotationFilters,
  QuotationStatusCounts,
} from '@/types/quotation'

const PAGE_SIZE = 7

export interface UseQuotationReturn {
  // State
  activeTab: QuotationTabType
  setActiveTab: (tab: QuotationTabType) => void
  filters: QuotationFilters
  setFilters: React.Dispatch<React.SetStateAction<QuotationFilters>>

  // Data
  rows: QuotationRow[]
  total: number
  counts: QuotationStatusCounts
  isLoading: boolean
  isError: boolean
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export function useQuotation(): UseQuotationReturn {
  const [activeTab, setActiveTab] = React.useState<QuotationTabType>('all')
  const [filters, setFilters] = React.useState<QuotationFilters>({})

  const combinedFilters = useMemo(() => {
    if (activeTab === 'all') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_admin, ...restFilters } = filters as Record<string, unknown>
      return restFilters
    }
    return {
      ...filters,
      filters: activeTab === 'admin' ? 'is_admin==true' : 'is_admin==false',
    }
  }, [filters, activeTab])

  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    { responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number } },
    Error,
    InfiniteData<{ responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number } }>,
    [string, Record<string, unknown>, number],
    number
  >({
    queryKey: ['quotations', combinedFilters, PAGE_SIZE],
    queryFn: async ({ pageParam = 1, signal }) => {
      const params = {
        page: pageParam,
        pageSize: PAGE_SIZE,
        sortField: 'created_at',
        sortOrder: SortOrderParameter.desc,
        ...combinedFilters,
      }
      const res = await getApiV10QuotationAll(params, signal)
      if (res.status !== 'success') {
        throw new Error(res.message ?? 'Failed to fetch quotations')
      }
      return res
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const responseData = lastPage?.responseData
      if (!responseData) return undefined
      const currentPage = responseData.page ?? 1
      const totalCount = responseData.count ?? 0
      const currentPageSize = responseData.pageSize ?? PAGE_SIZE
      const totalPages = Math.ceil(totalCount / currentPageSize)
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    staleTime: 5 * 60 * 1000,
  })

  const rows = useMemo(() => {
    if (!infiniteData?.pages) return [] as QuotationRow[]
    return infiniteData.pages.flatMap((page) => page?.responseData?.rows ?? []) as QuotationRow[]
  }, [infiniteData])

  const total = rows.length

  const counts = useMemo((): QuotationStatusCounts => {
    const c: QuotationStatusCounts = { new: 0, processing: 0, responded: 0, completed: 0 }
    rows.forEach((r) => {
      const receiveMethod = r.receive_method as Record<string, unknown> | undefined
      const statusRaw = receiveMethod?.['name']
      const status = typeof statusRaw === 'string' ? statusRaw.toLowerCase() : 'new'
      if (status === 'mới tạo' || !receiveMethod) c.new++
      else if (status.includes('xử lý')) c.processing++
      else if (status.includes('phản hồi')) c.responded++
      else if (status.includes('hoàn tất')) c.completed++
      else c.new++
    })
    return c
  }, [rows])

  return {
    activeTab, setActiveTab,
    filters, setFilters,
    rows, total, counts,
    isLoading, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  }
}
