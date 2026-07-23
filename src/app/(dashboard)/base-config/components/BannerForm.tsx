'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Upload, X } from 'lucide-react'
import { BannerMutate } from '@/api/models/bannerMutate'
import { toast } from '@/components/ui/toaster'

interface BannerFormProps {
  banner?: Record<string, unknown>
  onSubmit: (data: BannerMutate) => void
  onCancel: () => void
  isLoading: boolean
  displayTime?: string // Display time in seconds passed from parent
}

export default function BannerForm({ banner, onSubmit, onCancel, isLoading, displayTime = '5' }: BannerFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<BannerMutate>({
    defaultValues: {
      name: '',
      description: '',
      file_id: '',
      sort_order: '1',
      display_time: displayTime,
      is_active: true
    }
  })

  const isActive = watch('is_active') ?? true

  useEffect(() => {
    if (banner) {
      reset({
        name: String(banner.name || ''),
        description: String(banner.description || ''),
        file_id: String(banner.file_id || ''),
        sort_order: String(banner.sort_order || '1'),
        // Use displayTime from props instead of banner data
        display_time: displayTime,
        is_active: Boolean(banner.is_active ?? true)
      })
      // Set preview if banner has file
      if (banner.file_url) {
        setPreviewUrl(String(banner.file_url))
      }
    }
  }, [banner, reset])

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const videoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/avi",
      "video/mov",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];

    if (file.size > maxSize) {
      return `File "${file.name}" vượt quá 10MB`;
    }
    if (
      videoTypes.includes(file.type) ||
      file.name.match(/\.(mp4|webm|ogg|avi|mov|mkv)$/i)
    ) {
      return `File "${file.name}" là video, không được phép`;
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const error = validateFile(file);
      if (error) {
        toast.error({ title: 'Lỗi', content: error });
        event.target.value = '';
        return;
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      // In a real app, you'd upload the file and get an ID
      setValue('file_id', 'temp-file-id')
    }
  }

  const handleRemoveFile = () => {
    setPreviewUrl('')
    setValue('file_id', '')
  }

  const onFormSubmit = (data: BannerMutate) => {
    // Convert display_time from seconds to milliseconds
    const submissionData = {
      ...data,
      display_time: String(Number(data.display_time) * 1000)
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Banner Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tên banner *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Tên banner là bắt buộc' })}
          placeholder="Nhập tên banner"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Nhập mô tả banner"
          rows={3}
        />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Hình ảnh banner *</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          {previewUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Chọn tệp hình ảnh
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF tối đa 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sort_order">Thứ tự hiển thị</Label>
          <Input
            id="sort_order"
            type="number"
            min="1"
            {...register('sort_order')}
            placeholder="1"
          />
        </div>

        {/* Display Time */}
        <div className="space-y-2">
          <Label htmlFor="display_time">Thời gian hiển thị (giây)</Label>
          <Input
            id="display_time"
            type="number"
            min="1"
            {...register('display_time')}
            placeholder="5"
            value={displayTime}
            readOnly
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>Trạng thái hoạt động</Label>
          <p className="text-sm text-muted-foreground">
            Banner sẽ được hiển thị trên website khi được kích hoạt
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => setValue('is_active', checked)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {banner ? 'Đang cập nhật...' : 'Đang tạo...'}
            </div>
          ) : (
            banner ? 'Cập nhật' : 'Tạo mới'
          )}
        </Button>
      </div>
    </form>
  )
}