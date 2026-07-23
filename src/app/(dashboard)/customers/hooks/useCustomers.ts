'use client'

import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetApiV10User, useDeleteApiV10UserId } from '@api/endpoints/user'
import { toast } from '@components/ui/toaster'
import type { UserRow } from '@/types/customers'
import { getUserRowString } from '@/types/customers'

export interface UseCustomersReturn {
  search: string
  setSearch: (s: string) => void
  isCreateModalOpen: boolean
  setIsCreateModalOpen: (open: boolean) => void
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  selectedUserId: string | null
  setSelectedUserId: (id: string | null) => void
  filtered: UserRow[]
  isLoading: boolean
  isError: boolean
  handleDelete: (id: string) => Promise<void>
  handleModalSuccess: () => void
}

export function useCustomers(): UseCustomersReturn {
  const [search, setSearch] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useGetApiV10User({
    page: 1,
    pageSize: 12,
    filters: search ? `(email|username|last_name|first_name)@=${encodeURI(search)}` : '',
    sortField: 'created_at',
    sortOrder: 'desc',
  })

  const deleteMutation = useDeleteApiV10UserId()

  const filtered = useMemo(() => {
    const rows = (data?.responseData?.rows ?? []) as UserRow[]
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter((r) => {
      const username = getUserRowString(r, 'username').toLowerCase()
      const email = getUserRowString(r, 'email').toLowerCase()
      const firstName = getUserRowString(r, 'first_name').toLowerCase()
      const lastName = getUserRowString(r, 'last_name').toLowerCase()
      return username.includes(q) || email.includes(q) || firstName.includes(q) || lastName.includes(q)
    })
  }, [data?.responseData?.rows, search])

  const handleDelete = useCallback(async (id: string) => {
    const ok = confirm('Bạn có chắc muốn xóa tài khoản này?')
    if (!ok) return
    try {
      await deleteMutation.mutateAsync({ id })
      toast.success({ title: 'Xóa thành công', content: 'User đã được xóa.' })
      queryClient.invalidateQueries({ queryKey: ['/api/v1.0/user'] })
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Xóa thất bại'
      toast.error({ content: msg })
    }
  }, [deleteMutation, queryClient])

  const handleModalSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/v1.0/user'] })
  }, [queryClient])

  return {
    search, setSearch,
    isCreateModalOpen, setIsCreateModalOpen,
    isEditModalOpen, setIsEditModalOpen,
    selectedUserId, setSelectedUserId,
    filtered, isLoading, isError,
    handleDelete, handleModalSuccess,
  }
}
