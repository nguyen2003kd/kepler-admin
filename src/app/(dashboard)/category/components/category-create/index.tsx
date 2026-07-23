"use client"

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import { usePostApiV10Category, getGetApiV10CategoryQueryKey } from '@/api/endpoints/category'
import { CategoryForm } from '../category-form'
import type { CategoryFormProps } from '@/types/category'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
import type { CategoryMutate } from '@/api/models'
import { toast } from '@/components/ui/toaster'
import { extractErrorMessage } from '@/utils/error'

export const CategoryCreate: React.FC<{ parentId?: string; onOpenChange?: (open: boolean) => void }> = ({ parentId, onOpenChange }) => {
  const queryClient = useQueryClient()
  const postMutation = usePostApiV10Category()
  const [open, setOpen] = React.useState(!!parentId)
  const [values, setValues] = React.useState<CategoryFormProps['values']>({
    name: '',
    code: '',
    description: '',
    position: '',
    parent_category_id: parentId ?? '',
    link: '',
    is_service: false,
    icon_url: '',
  })

  // When a parentId prop is provided/changes, open the create form
  React.useEffect(() => {
    if (parentId) {
      setOpen(true)
      setValues(v => ({ ...v, parent_category_id: parentId }))
    }
  }, [parentId])

  const creating = postMutation.isPending

  const handleSave = async () => {
    if (!values.name.trim()) return
    const payload: Partial<CategoryMutate> & { name: string } = { name: values.name }
    if (values.code?.trim()) payload.code = values.code
    if (values.description?.trim()) payload.description = values.description
    if (values.position?.trim()) payload.position = Number(values.position)
    if (values.parent_category_id?.trim()) payload.parent_category_id = values.parent_category_id
    if (values.link?.trim()) payload.link = values.link
    if (values.is_service != null) payload.is_service = values.is_service
    if (values.icon_url?.trim()) payload.icon_url = values.icon_url
    try {
      await postMutation.mutateAsync({ data: payload as CategoryMutate })
      setValues({ name: '', code: '', description: '', position: '', parent_category_id: '', link: '', is_service: false, icon_url: '' })
      await queryClient.invalidateQueries({ queryKey: getGetApiV10CategoryQueryKey() })
      toast.success({ title: 'Tạo danh mục thành công', content: 'Danh mục mới đã được tạo.' })
      setOpen(false)
      onOpenChange?.(false)
    } catch (e) {
      console.error(e)
      const msg = extractErrorMessage(e)
      toast.error({ title: 'Tạo danh mục thất bại', content: msg })
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onOpenChange?.(false)
      setValues({ name: '', code: '', description: '', position: '', parent_category_id: '', link: '', is_service: false, icon_url: '' })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          onOpenChange?.(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#19426D] text-white">
          <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Tạo danh mục mới cho hệ thống. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>
        {/* <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isService"
              checked={!!values.is_service}
              onCheckedChange={(v) => setValues((s) => ({ ...s, is_service: !!v }))}
            />
            <Label htmlFor="isService">Dịch vụ</Label>
          </div>
        </div> */}

        <CategoryForm
          isEditing={false}
          values={values}
          categories={[]}
          saving={creating}
          onValuesChange={setValues}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
