'use client'

import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserMultiSelect } from '@/components/shared/user-select'
import { UserPlus, Trash2, Loader2, AlertCircle, ClipboardList } from 'lucide-react'
import { FallbackSpinner } from '@/components/shared/fallbackspinner'
import { Textarea } from '@/components/ui/textarea'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface ParticipantUser {
  id?: string
  email?: string
  username?: string | null
  first_name?: string | null
  last_name?: string | null
}

interface ParticipantItem {
  schedule_id?: string
  user_id?: string
  participant?: ParticipantUser
}

interface User {
  id?: string
  email?: string
  username?: string
  first_name?: string
  last_name?: string
}

interface ParticipantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheduleId: string
  eventTitle: string
  eventTasks: string
  participants: ParticipantItem[]
  isLoadingParticipants: boolean
  onRemoveParticipant: (scheduleId: string, userId: string) => Promise<void>
  onAddParticipants: (scheduleId: string, userIds: string[]) => Promise<void>
  refetchParticipants: () => void
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function getUserDisplayName(user: { username?: string | null; first_name?: string | null; last_name?: string | null; email?: string; id?: string }): string {
  const first = user.first_name || ''
  const last = user.last_name || ''
  if (first || last) return `${first} ${last}`.trim()
  return user.username || user.email || (user.id ?? '')
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export function ParticipantDialog({
  open,
  onOpenChange,
  scheduleId,
  eventTitle,
  eventTasks,
  participants,
  isLoadingParticipants,
  onRemoveParticipant,
  onAddParticipants,
  refetchParticipants,
}: ParticipantDialogProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Fetch all users (page 1, size 500) and build a lookup map by id
  const { data: userMap, isLoading: isLoadingUsers } = useQuery<Record<string, User>>({
    queryKey: ['participant-users'],
    queryFn: async () => {
      const { mainInstance } = await import('@/api/mutator/custom-instance')
      const result = await mainInstance<{ responseData?: { rows?: User[] } }>({
        url: '/api/v1.0/user',
        method: 'GET',
        params: { page: 1, pageSize: 500 },
      })

      const rows = result?.responseData?.rows ?? []
      const map: Record<string, User> = {}
      for (const u of rows) {
        if (u.id) map[u.id] = u
      }
      return map
    },
    staleTime: 5 * 60 * 1000,
  })

  const handleRemove = useCallback(
    async (userId: string) => {
      setRemovingId(userId)
      try {
        await onRemoveParticipant(scheduleId, userId)
        setRemovingId(null)
      } catch {
        setRemovingId(null)
      }
    },
    [scheduleId, onRemoveParticipant]
  )

  const handleAdd = useCallback(async () => {
    if (selectedUserIds.length === 0) return
    setIsAdding(true)
    try {
      await onAddParticipants(scheduleId, selectedUserIds)
      setSelectedUserIds([])
      refetchParticipants()
    } catch {
      // Error handled by hook
    } finally {
      setIsAdding(false)
    }
  }, [selectedUserIds, scheduleId, onAddParticipants, refetchParticipants])

  const handleClose = () => {
    setSelectedUserIds([])
    setRemovingId(null)
    setIsAdding(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quản lý người tham gia</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            <span className="line-clamp-1 font-medium text-foreground">{eventTitle}</span>
            Thêm hoặc xóa người tham gia cho lịch công tác này.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">

          {/* Công tác chuẩn bị */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <ClipboardList className="h-4 w-4 text-blue-500" />
              Công tác chuẩn bị
            </div>
            <Textarea
              value={eventTasks}
              readOnly
              rows={3}
              className="resize-none bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 cursor-default"
              placeholder="Chưa có Công tác chuẩn bị."
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Current participants list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Người tham gia ({participants.length})
              </span>
            </div>

            {isLoadingParticipants || isLoadingUsers ? (
              <div className="flex items-center justify-center py-6">
                <FallbackSpinner size="sm" />
              </div>
            ) : participants.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 py-4 px-3 text-sm text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Chưa có người tham gia nào.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {participants.map((p) => {
                  const displayName = p.participant ? getUserDisplayName(p.participant) : p.user_id ?? ''

                  return (
                    <Badge
                      key={p.user_id}
                      variant="secondary"
                      className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-sm font-medium"
                    >
                      <span className="truncate max-w-[180px]">{displayName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 text-muted-foreground hover:text-red-500"
                        disabled={removingId === p.user_id}
                        onClick={() => p.user_id && handleRemove(p.user_id)}
                      >
                        {removingId === p.user_id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Add participants */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Thêm người tham gia
            </span>

            <UserMultiSelect
              value={selectedUserIds}
              onChange={setSelectedUserIds}
              placeholder="Chọn người cần thêm..."
            />

            {/* Show selected users */}
            {selectedUserIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedUserIds.map((id) =>
                  userMap?.[id] ? (
                    <Badge key={id} variant="outline" className="text-sm">
                      {getUserDisplayName(userMap[id])}
                    </Badge>
                  ) : null
                )}
                <span className="text-xs text-muted-foreground">sẽ được thêm</span>
              </div>
            )}

            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-center"
              disabled={selectedUserIds.length === 0 || isAdding}
              onClick={handleAdd}
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Thêm người tham gia
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
