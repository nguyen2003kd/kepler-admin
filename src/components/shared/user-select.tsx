'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check } from 'lucide-react'

// API types
interface User {
  id?: string
  email?: string
  username?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  status?: string
}

interface UserListResponse {
  responseData?: {
    rows?: User[]
    total?: number
  }
  status?: string
}

interface UserSelectProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

interface UserMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function getUserDisplayName(user: User): string {
  const first = user.first_name || ''
  const last = user.last_name || ''
  const username = user.username || ''
  const email = user.email || ''

  if (first || last) return `${first} ${last}`.trim()
  if (username) return username
  return email
}

// ─── Single Select ────────────────────────────────────────────────────────────

export function UserSelect({
  value,
  onChange,
  placeholder = 'Chọn người chủ trì',
  disabled = false,
  className,
}: UserSelectProps) {
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useQuery<UserListResponse>({
    queryKey: ['user-select-list'],
    queryFn: async () => {
      const { mainInstance } = await import('@/api/mutator/custom-instance')
      return mainInstance<UserListResponse>({
        url: '/api/v1.0/user',
        method: 'GET',
        params: { page: 1, pageSize: 500 },
      })
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })

  const rows = data?.responseData?.rows ?? []
  const activeUsers = rows.filter((u) => u.status !== 'inactive' && u.id)

  const selectedUser = activeUsers.find((u) => u.id === value)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          {isLoading && open ? (
            <span className="text-muted-foreground">Đang tải...</span>
          ) : selectedUser ? (
            <span>{getUserDisplayName(selectedUser)}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[300px]">
        {activeUsers.length === 0 && !isLoading ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Không có người dùng nào
          </div>
        ) : (
          activeUsers.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onSelect={(e) => {
                e.preventDefault()
                onChange(user.id ?? '')
              }}
              className={cn('cursor-pointer', value === user.id && 'bg-accent')}
            >
              <span className="flex flex-col">
                <span>{getUserDisplayName(user)}</span>
                {user.email && (
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                )}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Multi Select ─────────────────────────────────────────────────────────────

export function UserMultiSelect({
  value,
  onChange,
  placeholder = 'Chọn người tham gia',
  disabled = false,
  className,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useQuery<UserListResponse>({
    queryKey: ['user-multiselect-list'],
    queryFn: async () => {
      const { mainInstance } = await import('@/api/mutator/custom-instance')
      return mainInstance<UserListResponse>({
        url: '/api/v1.0/user',
        method: 'GET',
        params: { page: 1, pageSize: 500 },
      })
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })

  const rows = data?.responseData?.rows ?? []
  const activeUsers = rows.filter((u) => u.status !== 'inactive' && u.id)

  const selectedUsers = activeUsers.filter((u) => value.includes(u.id ?? ''))
  const displayText = selectedUsers
    .map((u) => getUserDisplayName(u))
    .join(', ')

  const handleToggle = (userId: string) => {
    if (value.includes(userId)) {
      onChange(value.filter((v) => v !== userId))
    } else {
      onChange([...value, userId])
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex w-full items-start justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[42px]',
            className,
          )}
        >
          {isLoading && open ? (
            <span className="text-muted-foreground">Đang tải...</span>
          ) : displayText ? (
            <span className="text-left text-foreground leading-relaxed">{displayText}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[300px] max-h-[320px] overflow-y-auto">
        {activeUsers.length === 0 && !isLoading ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Không có người dùng nào
          </div>
        ) : (
          activeUsers.map((user) => {
            const isSelected = value.includes(user.id ?? '')
            return (
              <DropdownMenuItem
                key={user.id}
                onSelect={(e) => {
                  e.preventDefault()
                  handleToggle(user.id ?? '')
                }}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-3 w-full">
                  {/* Checkbox indicator */}
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-400 dark:border-gray-500',
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <span className="flex flex-col flex-1 min-w-0">
                    <span className={cn(isSelected && 'font-medium')}>
                      {getUserDisplayName(user)}
                    </span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    )}
                  </span>
                </span>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}