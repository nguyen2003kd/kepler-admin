'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Order } from '@/types'

export function useOrders() {
  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return []
    },
  })

  const statusCounts = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [orders])

  return { orders, isLoading, refetch, statusCounts }
}
