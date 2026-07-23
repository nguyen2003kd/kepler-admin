'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/types'

export interface ProductStats {
  total: number
  active: number
  lowStock: number
  outOfStock: number
}

export function useProducts() {
  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return []
    },
  })

  const stats = useMemo((): ProductStats => ({
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
  }), [products])

  return { products, isLoading, refetch, stats }
}
