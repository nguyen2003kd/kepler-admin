'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'
import { Image as ImageIcon, Trash2, Upload, Video, X } from 'lucide-react'
import { toast } from 'sonner'
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
import type { PropertyMutate } from '@/api/models/propertyMutate'
import {
  DIRECTIONS,
  GROUP_OPTIONS,
  MAX_MEDIA_FILES,
  STATUS_OPTIONS,
  UNIT_OPTIONS,
} from '../constants'

const propertySchema = z.object({
  title: z.string().max(255, 'Tối đa 255 ký tự').optional().nullable(),
  file_id: z.string().optional().nullable(),
  transaction_group: z.string().optional().nullable(),
  location: z.string().max(500, 'Tối đa 500 ký tự').optional().nullable(),
  architecture: z.string().optional().nullable(),
  price_unit: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
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

interface PropertyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: string | undefined, data: PropertyMutate) => void
  initialData?: Property | null
  isLoading?: boolean
}

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const emptyValues: PropertyFormValues = {
  title: '',
  file_id: '',
  transaction_group: 'SALE',
  location: '',
  architecture: '',
  price_unit: 'VND',
  status: 'DRAFT',
  category: '',
  direction: '',
  floors: null,
  toilets: null,
  street_frontage: '',
  living_rooms: null,
  bedrooms: null,
  legal: '',
  analysis: '',
  description: '',
  price: null,
  phone_sale: '',
}

const fileUrl = (file: ImagePickerFile) =>
  `${baseConfig.imgEndpointDomain}${file.compress_info?.desktop ||
  file.compress_info?.tablet ||
  file.path ||
  ''
  }`

const isVideo = (file: ImagePickerFile) => file.mime.startsWith('video/')

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
    defaultValues: emptyValues,
  })

  const [coverFile, setCoverFile] = useState<ImagePickerFile | null>(null)
  const [mediaFiles, setMediaFiles] = useState<ImagePickerFile[]>([])
  const [pickerMode, setPickerMode] = useState<'cover' | 'image' | 'video' | null>(
    null,
  )

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          title: initialData.title || '',
          file_id: initialData.file_id || '',
          transaction_group: initialData.transaction_group || 'SALE',
          location: initialData.location || '',
          architecture: initialData.architecture || '',
          price_unit: initialData.price_unit || 'VND',
          status: initialData.status || 'DRAFT',
          category: initialData.category || '',
          direction: initialData.direction || '',
          floors: initialData.floors ?? null,
          toilets: initialData.toilets ?? null,
          street_frontage: initialData.street_frontage || '',
          living_rooms: initialData.living_rooms ?? null,
          bedrooms: initialData.bedrooms ?? null,
          legal: initialData.legal || '',
          analysis: initialData.analysis || '',
          description: initialData.description || '',
          price: initialData.price ?? null,
          phone_sale: initialData.phone_sale || '',
        })
        const byId = new Map<string, ImagePickerFile>()
        const push = (f?: {
          id?: string | null
          path?: string | null
          name?: string | null
          mime?: string | null
          size?: number | null
        }) => {
          if (f?.id)
            byId.set(f.id, {
              id: f.id,
              path: f.path || '',
              name: f.name || '',
              mime: f.mime || '',
              size: String(f.size || 0),
            })
        }
        push(initialData.media?.find((f) => f.id === initialData.file_id))
          ; (initialData.media || []).forEach(push)
        const all = [...byId.values()]
        setCoverFile(
          all.find((f) => f.id === initialData.file_id) || null,
        )
        setMediaFiles(
          (initialData.media_file_ids || [])
            .map((id) => all.find((f) => f.id === id))
            .filter(Boolean) as ImagePickerFile[],
        )
      } else {
        form.reset(emptyValues)
        setCoverFile(null)
        setMediaFiles([])
      }
    }
  }, [open, initialData, form])

  const handleFileSelect = (file: ImagePickerFile) => {
    if (pickerMode === 'cover') {
      setCoverFile(file)
    } else {
      if (mediaFiles.some((f) => f.id === file.id)) {
        setPickerMode(null)
        return
      }
      if (mediaFiles.length >= MAX_MEDIA_FILES) {
        toast.error(`Chỉ chọn tối đa ${MAX_MEDIA_FILES} ảnh/video.`)
        setPickerMode(null)
        return
      }
      setMediaFiles((existing) => [...existing, file])
    }
    setPickerMode(null)
  }

  const handleSubmit = (values: PropertyFormValues) => {
    if (values.status === 'PUBLISHED' && !values.title?.trim()) {
      form.setError('title', {
        message: 'Điền tên bất động sản trước khi hiển thị.',
      })
      return
    }
    const mediaIds = [
      ...new Set([...mediaFiles.map((f) => f.id), coverFile?.id || ''].filter(Boolean)),
    ]
    onSubmit(initialData?.id, {
      title: values.title || null,
      transaction_group: (values.transaction_group || 'SALE') as PropertyMutate['transaction_group'],
      location: values.location || null,
      architecture: values.architecture || null,
      price_unit: (values.price_unit || 'VND') as PropertyMutate['price_unit'],
      status: (values.status || 'DRAFT') as PropertyMutate['status'],
      media_file_ids: mediaIds,
      description: values.description || null,
      category: values.category || null,
      direction: values.direction || null,
      floors: toNumberOrNull(values.floors),
      toilets: toNumberOrNull(values.toilets),
      street_frontage: values.street_frontage || null,
      living_rooms: toNumberOrNull(values.living_rooms),
      bedrooms: toNumberOrNull(values.bedrooms),
      legal: values.legal || null,
      file_id: coverFile?.id || null,
      analysis: values.analysis || null,
      price: toNumberOrNull(values.price),
      phone_sale: values.phone_sale || null,
    })
  }

  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[720px] bg-white dark:bg-gray-950">
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bất động sản</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Căn hộ chung cư Kepler Central"
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
                name="transaction_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm giao dịch</FormLabel>
                    <Select
                      value={field.value ?? 'SALE'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GROUP_OPTIONS.map((g) => (
                          <SelectItem key={g.value} value={g.value}>
                            {g.label}
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại bất động sản</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Căn hộ chung cư"
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vị trí</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: 123 Lê Lợi, Quận 1, TP.HCM"
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
                name="legal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pháp lý</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Sổ hồng chính chủ"
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
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
                name="price_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị giá</FormLabel>
                    <Select
                      value={field.value ?? 'VND'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNIT_OPTIONS.map((u) => (
                          <SelectItem key={u.value} value={u.value}>
                            {u.label}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hiển thị</FormLabel>
                    <Select
                      value={field.value ?? 'DRAFT'}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              name="architecture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kiến trúc / Tiện ích</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Kiến trúc và tiện ích của bất động sản"
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
                  <FormLabel>Phân tích / Xác thực</FormLabel>
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

            <FormField
              control={form.control}
              name="file_id"
              render={() => (
                <FormItem>
                  <FormLabel>Hình ảnh / Video</FormLabel>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPickerMode('cover')}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {coverFile ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPickerMode('image')}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Thêm ảnh
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setPickerMode('video')}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Thêm video
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chọn từ kho đang có; tối đa {MAX_MEDIA_FILES} ảnh/video.
                    </p>
                    {coverFile && (
                      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                          {isVideo(coverFile) ? (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                              <Video className="h-6 w-6 text-gray-400" />
                            </div>
                          ) : (
                            <Image
                              src={fileUrl(coverFile)}
                              alt={coverFile.title || coverFile.name || 'Ảnh đại diện'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <span className="min-w-0 flex-1 break-all text-sm font-medium">
                          {coverFile.name || coverFile.id} — ảnh đại diện
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setCoverFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {mediaFiles.length > 0 && (
                      <div className="space-y-2">
                        {mediaFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                          >
                            <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                              {isVideo(file) ? (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                                  <Video className="h-5 w-5 text-gray-400" />
                                </div>
                              ) : (
                                <Image
                                  src={fileUrl(file)}
                                  alt={file.title || file.name || 'Ảnh'}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              )}
                            </div>
                            <span className="min-w-0 flex-1 break-all text-sm">
                              {file.name || file.id}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() =>
                                setMediaFiles((existing) =>
                                  existing.filter((f) => f.id !== file.id),
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Đang lưu...' : isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <ImagePicker
        isOpen={!!pickerMode}
        onClose={() => setPickerMode(null)}
        onSelect={handleFileSelect}
        selectedFileId={
          pickerMode === 'cover' ? coverFile?.id : undefined
        }
        type={pickerMode === 'video' ? 'video' : 'image'}
      />
    </Dialog>
  )
}
