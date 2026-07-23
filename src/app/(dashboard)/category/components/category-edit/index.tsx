"use client"

import React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'
import { usePutApiV10CategoryId, useGetApiV10CategoryId } from '@/api/endpoints/category'

import { CategoryForm } from '../category-form'
import type { CategoryMutate } from '@/api/models'
import type { Category, CategoryFormProps } from '@/types/category'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'

export const CategoryEdit: React.FC<{ category: Category; onDone?: () => void }> = ({ category, onDone }) => {
  const [open, setOpen] = useState(true)
  const handleClose = () => {
    setOpen(false)
    onDone?.()
  }

  const queryClient = useQueryClient()
  const putMutation = usePutApiV10CategoryId()
  
  // Fetch detailed category data
  const { data: categoryDetailResp, isLoading: isLoadingDetail } = useGetApiV10CategoryId(category.id, {
    query: { 
      enabled: !!category.id,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  })
  
  // Helper to safely extract category data from response
  const getCategoryFromResp = (resp: unknown): Category | null => {
    if (!resp || typeof resp !== 'object') return null
    const r = resp as { responseData?: unknown }
    return (r.responseData as Category) || null
  }
  
  const categoryDetail = getCategoryFromResp(categoryDetailResp)
  
  const [values, setValues] = React.useState<CategoryFormProps['values']>({
    name: '',
    code: '',
    description: '',
    position: '',
    parent_category_id: '',
    link: '',
    is_service: false,
    icon_url: '',
  })

  // Update form values when detailed data is loaded
  React.useEffect(() => {
    const sourceCategory = categoryDetail || category
    setValues({
      name: sourceCategory.name || '',
      code: sourceCategory.code || '',
      description: sourceCategory.description || '',
      position: sourceCategory.position != null ? String(sourceCategory.position) : '',
      parent_category_id: sourceCategory.parent_category_id || '',
      link: sourceCategory.link || '',
      is_service: Boolean(sourceCategory.is_service),
      icon_url: sourceCategory.icon_url || '',
    })
  }, [categoryDetail, category])

  const saving = putMutation.isPending

  const handleSave = async () => {
    if (!values.name.trim()) return
    const payload: Partial<CategoryMutate> & { name: string; is_service?: boolean } = { 
      name: values.name,
      is_service: Boolean(values.is_service)
    }
    if (values.code?.trim()) payload.code = values.code
    if (values.description?.trim()) payload.description = values.description
    if (values.position?.trim()) payload.position = Number(values.position)
    if (values.parent_category_id?.trim()) payload.parent_category_id = values.parent_category_id
    if (values.link?.trim()) payload.link = values.link
    if (values.icon_url?.trim()) payload.icon_url = values.icon_url

    try {
      await putMutation.mutateAsync({ id: category.id, data: payload as CategoryMutate })
      await queryClient.invalidateQueries({ queryKey: ['/api/v1.0/category'] })
      toast.success({ title: 'Cập nhật danh mục thành công', content: 'Danh mục đã được cập nhật.' })
      onDone?.()
    } catch (e) {
      console.error(e)
      const msg = extractErrorMessage(e)
      toast.error({ title: 'Cập nhật danh mục thất bại', content: msg })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }} >
      <DialogContent className='max-w-5xl'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
        </DialogHeader>

        <CategoryForm
          isEditing={true}
          editingCategory={(categoryDetail || category) as Category}
          values={values}
          categories={[]}
          saving={saving || isLoadingDetail}
          onValuesChange={setValues}
          onSave={async () => {
            await handleSave()
            handleClose()
          }}
          onCancel={() => handleClose()}
        />

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
