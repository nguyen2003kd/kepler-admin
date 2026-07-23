'use client'

import React, { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import type { WorkEvent, WorkSchedule, WorkScheduleMutate } from '@/types/work-schedule'
import { mapWorkScheduleToWorkEvent } from '@/types/work-schedule'
import {
  getGetApiV10WorkScheduleQueryKey,
  useDeleteApiV10WorkScheduleId,
  useGetApiV10WorkSchedule,
  usePostApiV10WorkSchedule,
  usePutApiV10WorkScheduleId,
} from '@/api/endpoints/work-schedule'
import {
  getGetApiV10WorkScheduleIdParticipantsQueryKey,
  getGetApiV10ScheduleParticipantQueryKey,
  useGetApiV10ScheduleParticipant,
  useGetApiV10WorkScheduleIdParticipants,
  useDeleteApiV10ScheduleParticipantScheduleIdUserId,
  usePostApiV10ScheduleParticipantBulk,
} from '@/api/endpoints/schedule-participant'
import { useGetApiV10User } from '@/api/endpoints/user'
import { usePostApiV10Notifications } from '@/api/endpoints/notification'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

/** Participant with resolved user display name */
export interface ParticipantInfo {
  schedule_id: string
  user_id: string
  displayName: string
}

/** Raw user object from API */
interface RawUser {
  id?: string
  email?: string
  username?: string | null
  first_name?: string | null
  last_name?: string | null
}

/** Raw participant row from API */
interface RawParticipant {
  schedule_id?: string
  user_id?: string
  participant?: {
    id?: string
    email?: string
    username?: string | null
    first_name?: string | null
    last_name?: string | null
  }
}

/** Paginated API response wrapper (also handles plain array responseData) */
interface PaginatedResponse<T> {
  responseData?: T[] | {
    count?: number
    rows?: T[]
    page?: number
    pageSize?: number
  }
}

/** Safely extract rows array from a response that may be plain array or paginated */
function extractRows<T>(responseData: PaginatedResponse<T>['responseData']): T[] {
  if (!responseData) return []
  if (Array.isArray(responseData)) return responseData
  return responseData.rows ?? []
}

export interface UseWorkScheduleReturn {
  // State
  currentDate: Date
  setCurrentDate: (date: Date) => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  events: WorkEvent[]
  isFormOpen: boolean
  setIsFormOpen: (open: boolean) => void
  editingEvent: WorkEvent | null
  setEditingEvent: (event: WorkEvent | null) => void
  deleteConfirmOpen: boolean
  setDeleteConfirmOpen: (open: boolean) => void
  eventToDelete: string | null
  setEventToDelete: (id: string | null) => void

  // Participant dialog
  participantDialogOpen: boolean
  setParticipantDialogOpen: (open: boolean) => void
  participantEvent: WorkEvent | null

  // Loading / Error
  isLoading: boolean
  isFetching: boolean
  isSubmitting: boolean

  // Participants
  participantsData: RawParticipant[]
  isLoadingParticipants: boolean
  participantCounts: Record<string, number>
  participantsBySchedule: Record<string, ParticipantInfo[]>

  // Actions
  handleSelectDate: (date: Date) => void
  handleMonthChange: (date: Date) => void
  handleAddClick: () => void
  handleEditClick: (event: WorkEvent) => void
  handleDeleteClick: (id: string) => void
  handleManageParticipants: (event: WorkEvent) => void
  handleFormSubmit: (data: WorkScheduleMutate, originalEvent?: WorkEvent) => Promise<void>
  handleConfirmDelete: () => Promise<void>

  // Participant actions
  handleRemoveParticipant: (scheduleId: string, userId: string) => Promise<void>
  handleAddParticipants: (scheduleId: string, userIds: string[]) => Promise<void>

  // Refresh
  refetchSchedules: () => void
  refetchParticipants: () => void
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function getUserDisplayName(user: RawUser): string {
  const first = user.first_name || ''
  const last = user.last_name || ''
  if (first || last) return `${first} ${last}`.trim()
  if (user.username) return user.username
  return user.email || ''
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useWorkSchedule(): UseWorkScheduleReturn {
  const queryClient = useQueryClient()

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------
  const [currentDate, setCurrentDate] = React.useState(() => new Date())
  const [selectedDate, setSelectedDate] = React.useState(() => new Date())
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingEvent, setEditingEvent] = React.useState<WorkEvent | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [eventToDelete, setEventToDelete] = React.useState<string | null>(null)
  const [participantDialogOpen, setParticipantDialogOpen] = React.useState(false)
  const [participantEvent, setParticipantEvent] = React.useState<WorkEvent | null>(null)

  // ------------------------------------------------------------------
  // API Queries
  // ------------------------------------------------------------------

  const schedulesQuery = useGetApiV10WorkSchedule()
  const participantsQuery = useGetApiV10WorkScheduleIdParticipants(participantEvent?.id ?? '')
  const allParticipantsQuery = useGetApiV10ScheduleParticipant({ pageSize: 500 })
  const usersQuery = useGetApiV10User({ pageSize: 500 })

  // ------------------------------------------------------------------
  // Mutations
  // ------------------------------------------------------------------

  const postMutation = usePostApiV10WorkSchedule()
  const putMutation = usePutApiV10WorkScheduleId()
  const deleteMutation = useDeleteApiV10WorkScheduleId()
  const removeParticipantMutation = useDeleteApiV10ScheduleParticipantScheduleIdUserId()
  const addParticipantsMutation = usePostApiV10ScheduleParticipantBulk()
  const postNotificationMutation = usePostApiV10Notifications()

  const isSubmitting =
    postMutation.isPending ||
    putMutation.isPending ||
    deleteMutation.isPending

  // ------------------------------------------------------------------
  // User lookup map
  // ------------------------------------------------------------------

  const userMap = useMemo((): Record<string, string> => {
    const data = usersQuery.data as unknown as PaginatedResponse<RawUser>
    const rows = extractRows(data?.responseData)
    if (!rows.length) return {}
    const map: Record<string, string> = {}
    for (const u of rows) {
      if (u?.id) map[u.id] = getUserDisplayName(u)
    }
    return map
  }, [usersQuery.data])

  // ------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------

  const events: WorkEvent[] = useMemo(() => {
    const data = schedulesQuery.data as unknown as PaginatedResponse<WorkSchedule>
    const rows = extractRows(data?.responseData)
    if (!Array.isArray(rows)) return []
    return rows
      .map((ws) => mapWorkScheduleToWorkEvent(ws))
      .filter((e) => !!e.id)
  }, [schedulesQuery.data])

  // ------------------------------------------------------------------
  // Participants for dialog
  // ------------------------------------------------------------------

  const participantsData = useMemo((): RawParticipant[] => {
    const data = participantsQuery.data as unknown as PaginatedResponse<RawParticipant>
    return extractRows(data?.responseData)
  }, [participantsQuery.data])

  // ------------------------------------------------------------------
  // All participants — counts + enriched with names
  // ------------------------------------------------------------------

  const { participantCounts, participantsBySchedule } = useMemo(() => {
    const data = allParticipantsQuery.data as unknown as PaginatedResponse<RawParticipant>
    const rows = extractRows(data?.responseData)
    if (!Array.isArray(rows)) return { participantCounts: {}, participantsBySchedule: {} }

    const counts: Record<string, number> = {}
    const bySchedule: Record<string, ParticipantInfo[]> = {}

    for (const row of rows) {
      const sid = row.schedule_id
      const uid = row.user_id
      if (!sid || !uid) continue

      counts[sid] = (counts[sid] ?? 0) + 1

      // Ưu tiên lấy tên từ participant nested trong API
      const participantName = row.participant
        ? getUserDisplayName(row.participant)
        : userMap[uid] ?? uid

      if (!bySchedule[sid]) bySchedule[sid] = []
      bySchedule[sid].push({
        schedule_id: sid,
        user_id: uid,
        displayName: participantName,
      })
    }

    return { participantCounts: counts, participantsBySchedule: bySchedule }
  }, [allParticipantsQuery.data, userMap])

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentDate(date)
  }, [])

  const handleAddClick = useCallback(() => {
    setEditingEvent(null)
    setIsFormOpen(true)
  }, [])

  const handleEditClick = useCallback((event: WorkEvent) => {
    setEditingEvent(event)
    setIsFormOpen(true)
  }, [])

  const handleDeleteClick = useCallback((id: string) => {
    setEventToDelete(id)
    setDeleteConfirmOpen(true)
  }, [])

  const handleManageParticipants = useCallback((event: WorkEvent) => {
    setParticipantEvent(event)
    setParticipantDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data: WorkScheduleMutate, originalEvent?: WorkEvent) => {
      try {
        if (editingEvent && originalEvent) {
          await putMutation.mutateAsync({ id: editingEvent.id, data })
          toast.success('Cập nhật lịch công tác thành công!')
        } else {
          await postMutation.mutateAsync({ data })
          toast.success('Đã thêm lịch công tác mới!')

          // Re-fetch schedules to get the newly created schedule id
          await queryClient.invalidateQueries({ queryKey: getGetApiV10WorkScheduleQueryKey() })
        }
        setIsFormOpen(false)
        setEditingEvent(null)
      } catch (error) {
        toast.error(extractErrorMessage(error) || 'Có lỗi xảy ra')
        throw error
      }
    },
    [editingEvent, putMutation, postMutation, queryClient]
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!eventToDelete) return
    try {
      await deleteMutation.mutateAsync({ id: eventToDelete })
      toast.success('Đã xóa lịch công tác khỏi hệ thống.')
      await queryClient.invalidateQueries({ queryKey: getGetApiV10WorkScheduleQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Không thể xóa lịch công tác.')
    } finally {
      setDeleteConfirmOpen(false)
      setEventToDelete(null)
    }
  }, [eventToDelete, deleteMutation, queryClient])

  const handleRemoveParticipant = useCallback(
    async (scheduleId: string, userId: string) => {
      try {
        await removeParticipantMutation.mutateAsync({ scheduleId, userId })
        toast.success('Đã xóa người tham gia.')
        await queryClient.invalidateQueries({
          queryKey: getGetApiV10WorkScheduleIdParticipantsQueryKey(scheduleId),
        })
        await queryClient.invalidateQueries({
          queryKey: getGetApiV10ScheduleParticipantQueryKey(),
        })
      } catch (error) {
        toast.error(extractErrorMessage(error) || 'Không thể xóa người tham gia.')
      }
    },
    [removeParticipantMutation, queryClient]
  )

  const handleAddParticipants = useCallback(
    async (scheduleId: string, userIds: string[]) => {
      try {
        const result = await addParticipantsMutation.mutateAsync({
          data: { schedule_id: scheduleId, user_ids: userIds },
        })
        const skipped = (result as unknown as { skippedUserIds?: string[] })?.skippedUserIds ?? []
        if (skipped.length > 0) {
          toast.warning(`${skipped.length} người đã có trong lịch và bị bỏ qua.`)
        } else {
          toast.success(`Đã thêm ${userIds.length} người tham gia.`)
        }

        // Notify each added participant
        const addedUserIds = userIds.filter((id) => !skipped.includes(id))
        await Promise.allSettled(
          addedUserIds.map((userId) =>
            postNotificationMutation.mutateAsync({
              data: {
                title: 'Thông báo hệ thống',
                content: 'Bạn được thêm vào lịch công tác mới.',
                belongs_to_user_id: [userId],
              },
            }),
          ),
        )

        await queryClient.invalidateQueries({
          queryKey: getGetApiV10WorkScheduleIdParticipantsQueryKey(scheduleId),
        })
        await queryClient.invalidateQueries({
          queryKey: getGetApiV10ScheduleParticipantQueryKey(),
        })
      } catch (error) {
        toast.error(extractErrorMessage(error) || 'Không thể thêm người tham gia.')
      }
    },
    [addParticipantsMutation, postNotificationMutation, queryClient]
  )

  const refetchSchedules = useCallback(() => {
    void schedulesQuery.refetch()
  }, [schedulesQuery])

  const refetchParticipants = useCallback(() => {
    if (participantEvent?.id) {
      void participantsQuery.refetch()
    }
  }, [participantEvent?.id, participantsQuery])

  return {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    events,
    isFormOpen,
    setIsFormOpen,
    editingEvent,
    setEditingEvent,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    eventToDelete,
    setEventToDelete,
    participantDialogOpen,
    setParticipantDialogOpen,
    participantEvent,
    isLoading: schedulesQuery.isLoading,
    isFetching: schedulesQuery.isFetching,
    isSubmitting,
    participantsData,
    isLoadingParticipants: participantsQuery.isLoading,
    participantCounts,
    participantsBySchedule,
    handleSelectDate,
    handleMonthChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleManageParticipants,
    handleFormSubmit,
    handleConfirmDelete,
    handleRemoveParticipant,
    handleAddParticipants,
    refetchSchedules,
    refetchParticipants,
  }
}
