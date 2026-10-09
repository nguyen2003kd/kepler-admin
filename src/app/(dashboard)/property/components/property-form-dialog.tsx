'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImagePicker, type ImagePickerFile } from '@/components/shared'
import baseConfig from '@configs/base'
import type { Property } from '@/api/models/property'

export type PropertyFile = {
  id?: string
  path?: string | null
  name?: string | null
  mime?: string | null
  compress_info?: {
    mobile?: string
    tablet?: string
    desktop?: string
    preload?: string
  } | null
}

export type PropertyWithFile = Property & { file?: PropertyFile | null }

const DIRECTIONS = [
  'Đông',
  'Tây',
  'Nam',
  'Bắc',
  'Đông Bắc',
  'Đông Nam',
  'Tây Bắc',
  'Tây Nam',
] as const

const propertySchema = z.object({
  category: z.string().max(100, 'Tối đa 100 ký tự').optional().nullable(),
  direction: z.string().max(50, 'Tối đa 50 ký tự').optional().nullable(),
  floors: z
    .number({ error: 'Vui lòng nhập số' })
    .min(0, 'Phải >= 0')
    .optional()
    .nullable(),
  toilets: z
    .number({ error: 'Vui lòng nhập số' })
    .min(0, 'Phải >= 0')
    .optional()
    .nullable(),
  street_frontage: z.string().max(100, 'Tối đa 100 ký tự').optional().nullable(),
  living_rooms: z
    .number({ error: 'Vui lòng nhập số' })
    .min(0, 'Phải >= 0')
    .optional()
    .nullable(),
  bedrooms: z
    .number({ error: 'Vui lòng nhập số' })
    .min(0, 'Phải >= 0')
    .optional()
    .nullable(),
  legal: z.string().max(255, 'Tối đa 255 ký tự').optional().nullable(),
  file_id: z.string().optional().nullable(),
  analysis: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z
    .number({ error: 'Vui lòng nhập số' })
    .min(0, 'Phải >= 0')
    .optional()
    .nullable(),
  phone_sale: z.string().max(20, 'Tối đa 20 ký tự').optional().nullable(),
})

type PropertyFormValues = z.infer<typeof propertySchema>

export type PropertySubmitValues = {
  category?: string | null
  direction?: string | null
  floors?: number | null
  toilets?: number | null
  street_frontage?: string | null
  living_rooms?: number | null
  bedrooms?: number | null
  legal?: string | null
  file_id?: string | null
  analysis?: string | null
  description?: string | null
  price?: number | null
  phone_sale?: string | null
}

interface PropertyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PropertySubmitValues) => void
  initialData?: PropertyWithFile | null
  isLoading?: boolean
}

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function PropertyFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
}: PropertyFormDialogProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      category: '',
      direction: '',
      floors: null,
      toilets: null,
      street_frontage: '',
      living_rooms: null,
      bedrooms: null,
      legal: '',
      file_id: '',
      analysis: '',
      description: '',
      price: null,
      phone_sale: '',
    },
  })

  const [selectedFile, setSelectedFile] = useState<ImagePickerFile | null>(null)
  const [filePickerOpen, setFilePickerOpen] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          category: initialData.category || '',
          direction: initialData.direction || '',
          floors: initialData.floors ?? null,
          toilets: initialData.toilets ?? null,
          street_frontage: initialData.street_frontage || '',
          living_rooms: initialData.living_rooms ?? null,
          bedrooms: initialData.bedrooms ?? null,
          legal: initialData.legal || '',
          file_id: initialData.file_id || '',
          analysis: initialData.analysis || '',
          description: initialData.description || '',
          price: initialData.price ?? null,
          phone_sale: initialData.phone_sale || '',
        })
        setSelectedFile(
          initialData.file
            ? {
                id: initialData.file.id || initialData.file_id || '',
                path: initialData.file.path || '',
                name: initialData.file.name || '',
                mime: initialData.file.mime || '',
                size: '',
                compress_info: initialData.file.compress_info
                  ? {
                      mobile: initialData.file.compress_info.mobile || '',
                      tablet: initialData.file.compress_info.tablet || '',
                      desktop: initialData.file.compress_info.desktop || '',
                      preload: initialData.file.compress_info.preload || '',
                    }
                  : undefined,
              }
            : null,
        )
      } else {
        form.reset({
          category: '',
          direction: '',
          floors: null,
          toilets: null,
          street_frontage: '',
          living_rooms: null,
          bedrooms: null,
          legal: '',
          file_id: '',
          analysis: '',
          description: '',
          price: null,
          phone_sale: '',
        })
        setSelectedFile(null)
      }
    }
  }, [open, initialData, form])

  const handleFileSelect = (file: ImagePickerFile) => {
    setSelectedFile(file)
    form.setValue('file_id', file.id)
    setFilePickerOpen(false)
  }

  const handleFileClear = () => {
    setSelectedFile(null)
    form.setValue('file_id', null)
  }

  const handleSubmit = (values: PropertyFormValues) => {
    onSubmit({
      category: values.category || null,
      direction: values.direction || null,
      floors: toNumberOrNull(values.floors),
      toilets: toNumberOrNull(values.toilets),
      street_frontage: values.street_frontage || null,
      living_rooms: toNumberOrNull(values.living_rooms),
      bedrooms: toNumberOrNull(values.bedrooms),
      legal: values.legal || null,
      file_id: values.file_id || null,
      analysis: values.analysis || null,
      description: values.description || null,
      price: toNumberOrNull(values.price),
      phone_sale: values.phone_sale || null,
    })
    onOpenChange(false)
  }

  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px] bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Chỉnh sửa bất động sản' : 'Thêm bất động sản mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Cập nhật thông tin bất động sản.'
              : 'Điền thông tin để tạo bất động sản mới.'}
          </DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Căn hộ chung cư" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hướng nhà</FormLabel>
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hướng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIRECTIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="VD: 2500000000"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_sale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SĐT nhân viên bán hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 0901234567" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tầng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng ngủ</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="living_rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng khách</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toilets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số toilet</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value === '' ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street_frontage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mặt tiền đường</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 8m" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pháp lý</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Sổ hồng chính chủ" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file_id"
                render={() => (
                  <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {selectedFile ? (
                      <div className="relative inline-block">
                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
                          <Image
                            src={`${baseConfig.imgEndpointDomain}${
                              selectedFile.compress_info?.desktop ||
                              selectedFile.compress_info?.tablet ||
                              selectedFile.path ||
                              ''
                            }`}
                            alt={selectedFile.title || selectedFile.name || 'Ảnh bất động sản'}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleFileClear}
                          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Upload className="mb-1 h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Chưa chọn ảnh</span>
                      </div>
                    )}
                    <Button type="button" variant="outline" onClick={() => setFilePickerOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      {selectedFile ? 'Đổi ảnh' : 'Chọn ảnh từ thư viện'}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                  </FormItem>
                )}
              />
          </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết bất động sản"
                      rows={3}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="analysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phân tích</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Phân tích bất động sản"
                      rows={3}
                      {...field}
                      value={field.value ?? ''}
                    />
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

      <ImagePicker
        isOpen={filePickerOpen}
        onClose={() => setFilePickerOpen(false)}
        onSelect={handleFileSelect}
        selectedFileId={selectedFile?.id}
        type="image"
      />
    </Dialog>
  )
}
