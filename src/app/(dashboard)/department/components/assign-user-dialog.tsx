'use client'

import React, { useState } from 'react'
import { Loader2, Trash2, UserPlus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useGetApiV10User } from '@/api/endpoints/user'
import {
  getApiV10UserDepartment,
  useDeleteApiV10UserDepartmentId,
  usePostApiV10UserDepartment,
} from '@/api/endpoints/user-department'
import type { User } from '@/api/models/user'
import type { UserDepartment } from '@/api/models/userDepartment'
import type { Department } from '@/api/models/department'

interface AssignUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
  onRefresh?: () => void
}

export function AssignUserDialog({
  open,
  onOpenChange,
  department,
  onRefresh,
}: AssignUserDialogProps) {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  // Fetch all users
  const { data: allUsersData, isLoading: isLoadingUsers } = useGetApiV10User(
    { pageSize: 500 },
    undefined,
  )

  // Fetch assigned users for this department
  const { data: assignedData, isLoading: isLoadingAssigned } = useQuery({
    queryKey: ['user-departments', department?.id],
    queryFn: async () => {
      if (!department?.id) return []
      const res = await getApiV10UserDepartment({
        filters: `department_id==${department.id}`,
        pageSize: 500,
      })
      return (res as { responseData?: { rows?: UserDepartment[] } })?.responseData?.rows || []
    },
    enabled: !!department?.id && open,
    staleTime: 30_000,
  })

  // Post mutation
  const assignMutation = usePostApiV10UserDepartment()
  const deleteMutation = useDeleteApiV10UserDepartmentId()

  // Normalize all users
  const allUsers: User[] = React.useMemo(() => {
    if (!allUsersData) return []
    const rows = (allUsersData as { responseData?: { rows?: User[] } })?.responseData?.rows
    return Array.isArray(rows) ? rows : []
  }, [allUsersData])

  const assignedUserIds = new Set((assignedData || []).map((u) => u.user_id))

  const availableUsers = allUsers.filter((u) => !assignedUserIds.has(u.id))

  const handleAssign = async () => {
    if (!selectedUserId || !department?.id) return
    try {
      await assignMutation.mutateAsync({
        data: { user_id: selectedUserId, department_id: department.id },
      })
      await queryClient.invalidateQueries({ queryKey: ['user-departments', department.id] })
      setSelectedUserId('')
      toast.success('Gắn người dùng thành công')
      onRefresh?.()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const handleRemove = async (userDeptId: string) => {
    try {
      await deleteMutation.mutateAsync({ id: userDeptId })
      await queryClient.invalidateQueries({ queryKey: ['user-departments', department?.id] })
      toast.success('Đã xóa người dùng khỏi phòng ban')
      onRefresh?.()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const getUserById = (userId?: string) =>
    allUsers.find((u) => u.id === userId)

  const isLoading = isLoadingUsers || isLoadingAssigned

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Gắn nhân viên vào phòng ban</DialogTitle>
          <DialogDescription>
            Quản lý danh sách nhân viên thuộc{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {department?.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Assign new user */}
          <div className="flex gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn nhân viên để gắn..." />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    Không còn nhân viên nào để gắn
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id || ''}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {(user.first_name || user.email || '?').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssign}
              disabled={!selectedUserId || assignMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            >
              {assignMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Assigned users list */}
          <div>
            <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Nhân viên trong phòng ban ({(assignedData || []).length})
            </p>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (assignedData || []).length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 py-6 text-center text-sm text-gray-400 dark:border-gray-800">
                Chưa có nhân viên nào trong phòng ban này.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(assignedData || []).map((ud) => {
                    const user = getUserById(ud.user_id)
                    return (
                      <div
                        key={ud.id}
                        className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {(user?.first_name || user?.email || '?').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '—'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                          onClick={() => ud.id && handleRemove(ud.id)}
                          title="Xóa khỏi phòng ban"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
