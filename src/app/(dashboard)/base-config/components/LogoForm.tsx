'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Upload, X, ExternalLink } from 'lucide-react'
import { LogoMutate } from '@/api/models/logoMutate'
import { toast } from '@/components/ui/toaster'

interface LogoFormProps {
  logo?: Record<string, unknown>
  onSubmit: (data: LogoMutate) => void
  onCancel: () => void
  isLoading: boolean
}

export default function LogoForm({ logo, onSubmit, onCancel, isLoading }: LogoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LogoMutate>({
    defaultValues: {
      name: '',
      file_id: '',
      navigation_link: '',
      is_active: true
    }
  })

  const isActive = watch('is_active')
  const navigationLink = watch('navigation_link')

  useEffect(() => {
    if (logo) {
      reset({
        name: String(logo.name || ''),
        file_id: String(logo.file_id || ''),
        navigation_link: String(logo.navigation_link || ''),
        is_active: Boolean(logo.is_active ?? true)
      })
      // Set preview if logo has file
      if (logo.file_url) {
        setPreviewUrl(String(logo.file_url))
      }
    }
  }, [logo, reset])

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

  const onFormSubmit = (data: LogoMutate) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Logo Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tên logo *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Tên logo là bắt buộc' })}
          placeholder="Nhập tên logo"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>Hình ảnh logo *</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          {previewUrl ? (
            <div className="relative">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="max-w-xs max-h-32 object-contain rounded-lg bg-white p-2 border"
                />
              </div>
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
                    Chọn tệp logo
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
                  PNG, JPG, SVG tối đa 5MB. Khuyến nghị nền trong suốt
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Link */}
      <div className="space-y-2">
        <Label htmlFor="navigation_link">Link điều hướng</Label>
        <div className="relative">
          <Input
            id="navigation_link"
            {...register('navigation_link', {
              pattern: {
                value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                message: 'URL không hợp lệ'
              }
            })}
            placeholder="https://example.com"
          />
          {navigationLink && (
            <a
              href={navigationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-600"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {errors.navigation_link && (
          <p className="text-sm text-red-600">{errors.navigation_link.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Người dùng sẽ được chuyển hướng đến link này khi click vào logo
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label>Trạng thái hoạt động</Label>
          <p className="text-sm text-muted-foreground">
            Logo sẽ được hiển thị trên website khi được kích hoạt
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => setValue('is_active', checked)}
        />
      </div>

      {/* Preview Section */}
      {previewUrl && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium">Xem trước</Label>
          <div className="mt-2 p-4 bg-white rounded border flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Logo preview"
              className="max-h-16 object-contain"
            />
          </div>
        </div>
      )}

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
              {logo ? 'Đang cập nhật...' : 'Đang tạo...'}
            </div>
          ) : (
            logo ? 'Cập nhật' : 'Tạo mới'
          )}
        </Button>
      </div>
    </form>
  )
}