'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Page } from '@/api/models/page'

const pageSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên trang').max(255),
  type: z.enum(['DESIGNED', 'NEWS'], { message: 'Vui lòng chọn loại trang' }),
  description: z.string().optional(),
  path: z.string().optional(),
})

type PageFormValues = z.infer<typeof pageSchema>

const PAGE_TYPES = [
  { value: 'DESIGNED', label: 'Trang thiết kế sẵn' },
  { value: 'NEWS', label: 'Trang tin tức' },
]

interface PageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PageFormValues) => void
  initialData?: Page | null
  isLoading?: boolean
}

export function PageFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: PageFormDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<PageFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pageSchema) as any,
    defaultValues: {
      name: '',
      type: 'DESIGNED',
      description: '',
      path: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name || '',
          type: initialData.type || 'DESIGNED',
          description: initialData.description || '',
          path: initialData.path || '',
        })
      } else {
        form.reset({
          name: '',
          type: 'DESIGNED',
          description: '',
          path: '',
        })
      }
    }
  }, [open, initialData, form])

  const handleSubmit = (values: PageFormValues) => {
    onSubmit(values)
    onOpenChange(false)
  }

  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa trang' : 'Thêm trang mới'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Cập nhật thông tin trang.'
              : 'Điền thông tin để tạo trang mới.'}
          </DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên trang</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Tin tức" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại trang</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại trang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAGE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn</FormLabel>
                  <FormControl>
                    <Input disabled={isEditing} placeholder="VD: /tin-tuc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả ngắn về trang này" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
