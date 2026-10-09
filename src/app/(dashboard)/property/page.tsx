'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import {
  Building,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useGetApiV10Property,
  usePostApiV10Property,
  usePutApiV10PropertyId,
  useDeleteApiV10PropertyId,
  getGetApiV10PropertyQueryKey,
} from '@/api/endpoints/property'
import {
  PropertyFormDialog,
  type PropertySubmitValues,
  type PropertyWithFile,
} from './components/property-form-dialog'
import baseConfig from '@configs/base'
import { Header } from '@/components/layout/header'
import { useAbility } from '@/hooks/use-ability'

const formatPrice = (price?: number | null): string => {
  if (price === null || price === undefined) return '—'
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ`
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1).replace(/\.0$/, '')} triệu`
  return price.toLocaleString('vi-VN')
}

export default function PropertyPage() {
  const ability = useAbility()
  const queryClient = useQueryClient()

  const canCreateProperty = ability.can('create', 'property')
  const canEditProperty = ability.can('update', 'property')
  const canDeleteProperty = ability.can('delete', 'property')

  const [search, setSearch] = useState('')
  const [editingProperty, setEditingProperty] = useState<PropertyWithFile | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingProperty, setDeletingProperty] = useState<PropertyWithFile | null>(null)

  // Fetch properties
  const { data: propertyData, isLoading } = useGetApiV10Property(
    { pageSize: 100 },
    undefined,
  )

  // Mutations
  const createMutation = usePostApiV10Property()
  const updateMutation = usePutApiV10PropertyId()
  const deleteMutation = useDeleteApiV10PropertyId()

  // Normalize
  const properties: PropertyWithFile[] = React.useMemo(() => {
    if (!propertyData) return []
    const rows = (propertyData as { responseData?: { rows?: PropertyWithFile[] } })?.responseData
      ?.rows
    return Array.isArray(rows) ? rows : []
  }, [propertyData])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return properties
    const q = search.toLowerCase()
    return properties.filter(
      (p) =>
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.legal?.toLowerCase().includes(q) ||
        p.direction?.toLowerCase().includes(q) ||
        p.street_frontage?.toLowerCase().includes(q),
    )
  }, [properties, search])

  const isMutating = createMutation.isPending || updateMutation.isPending

  // Handlers
  const handleOpenCreate = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (property: PropertyWithFile) => {
    setEditingProperty(property)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (values: PropertySubmitValues) => {
    try {
      if (editingProperty?.id) {
        await updateMutation.mutateAsync({
          id: editingProperty.id,
          data: values,
        })
        toast.success('Cập nhật bất động sản thành công')
      } else {
        await createMutation.mutateAsync({
          data: values,
        })
        toast.success('Tạo bất động sản thành công')
      }
      await queryClient.invalidateQueries({ queryKey: getGetApiV10PropertyQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deletingProperty?.id) return
    try {
      await deleteMutation.mutateAsync({ id: deletingProperty.id })
      toast.success('Xóa bất động sản thành công')
      setDeletingProperty(null)
      await queryClient.invalidateQueries({ queryKey: getGetApiV10PropertyQueryKey() })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <>
      <Header title="Bất động sản" />
      <div className="flex h-full min-h-[calc(100vh-theme(spacing.16))] flex-col space-y-6 bg-gray-50/30 p-4 md:p-8 dark:bg-gray-950/30">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              <Building className="mr-3 h-7 w-7 text-blue-600 dark:text-blue-500" />
              Bất động sản
            </h1>
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
              Quản lý danh sách bất động sản: thông tin, giá, pháp lý và tiện ích.
            </p>
          </div>

          <Button
            onClick={handleOpenCreate}
            disabled={!canCreateProperty}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-md shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm bất động sản
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bất động sản..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-gray-900"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filtered.length} / {properties.length} bất động sản
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Ảnh
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Thể loại
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Hướng
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Giá
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    PN / PT / Tầng
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Pháp lý
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Mô tả
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang tải...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-gray-400">
                      Không tìm thấy bất động sản nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-gray-50 transition-colors hover:bg-blue-50/30 dark:border-gray-800 dark:hover:bg-gray-900"
                    >
                      <td className="px-4 py-3 text-center">
                        {property.file?.path ? (
                          <div className="relative mx-auto h-12 w-16 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <Image
                              src={`${baseConfig.imgEndpointDomain}${
                                property.file.compress_info?.desktop ||
                                property.file.compress_info?.tablet ||
                                property.file.path
                              }`}
                              alt={property.file.name || property.category || 'Bất động sản'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="mx-auto flex h-12 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                          {property.category || '—'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {property.direction || '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                        {formatPrice(property.price)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                        {property.bedrooms ?? '—'} / {property.toilets ?? '—'} / {property.floors ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {property.legal || '—'}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                          {property.description || '—'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit */}
                          {canEditProperty && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:text-emerald-400"
                              onClick={() => handleOpenEdit(property)}
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Delete */}
                          {canDeleteProperty && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:text-red-400"
                              onClick={() => setDeletingProperty(property)}
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Dialog */}
        <PropertyFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={editingProperty}
          isLoading={isMutating}
        />

        {/* Delete Confirm */}
        <AlertDialog open={!!deletingProperty} onOpenChange={(open) => !open && setDeletingProperty(null)}>
          <AlertDialogContent className="bg-white dark:bg-gray-950">
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa bất động sản</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc muốn xóa bất động sản{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {deletingProperty?.category || 'này'}
                </span>
                ? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
