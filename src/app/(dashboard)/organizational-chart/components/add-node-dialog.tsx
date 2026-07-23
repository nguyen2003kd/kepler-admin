import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePicker, type ImagePickerFile } from '@/components/shared/image-picker';
import baseConfig from '@configs/base';
import type { AddNodeData, OrgNode, NodeSize } from '@/types/organizational-chart';

const nodeSchema = z.object({
  full_name: z.string().min(1, 'Vui lòng nhập họ và tên').max(255, 'Tối đa 255 ký tự'),
  position: z.string().min(1, 'Vui lòng nhập chức vụ').max(255, 'Tối đa 255 ký tự'),
  department_id: z.string().min(1, 'Vui lòng nhập phòng ban / khối').max(255),
  description: z.string().optional(),
  avatar_url: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        if (!value) return true;
        return /^https?:\/\//i.test(value) || value.startsWith('/');
      },
      'Avatar phải là URL hợp lệ hoặc đường dẫn bắt đầu bằng /'
    ),
  color: z.string().optional().or(z.literal('')),
  size_width: z.coerce.number().int().min(60).max(3000).optional().or(z.literal('')),
  size_height: z.coerce.number().int().min(60).max(3000).optional().or(z.literal('')),
});

type NodeFormValues = z.infer<typeof nodeSchema>;

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddNodeData) => void;
  initialData?: OrgNode | null;
  departments?: Array<{ id: string; name: string }>;
}

export function AddNodeDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  departments = [],
}: AddNodeDialogProps) {
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<NodeFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(nodeSchema) as any,
    defaultValues: {
      full_name: '',
      position: '',
      department_id: '',
      description: '',
      avatar_url: '',
      color: '',
      size_width: '',
      size_height: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          full_name: initialData.full_name,
          position: initialData.position,
          department_id: initialData.department_id || '',
          description: initialData.description ?? '',
          avatar_url: initialData.avatar_url ?? '',
          color: initialData.color ?? '',
          size_width: initialData.size?.width ?? '',
          size_height: initialData.size?.height ?? '',
        });
      } else {
        form.reset({
          full_name: '',
          position: '',
          department_id: '',
          description: '',
          avatar_url: '',
          color: '',
          size_width: '',
          size_height: '',
        });
      }

      setSelectedAvatarId(undefined);
      setIsImagePickerOpen(false);
    }
  }, [open, form, initialData]);

  const resolveAvatarSrc = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;
    if (value.startsWith('/')) return `${baseConfig.imgEndpointDomain}${value}`;
    return `${baseConfig.imgEndpointDomain}/${value}`;
  };

  const handleSelectAvatar = (file: ImagePickerFile) => {
    form.setValue('avatar_url', file.path, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setSelectedAvatarId(file.id);
    setIsImagePickerOpen(false);
  };

  const handleSubmit = (values: NodeFormValues) => {
    const size: NodeSize | null =
      values.size_width && values.size_height
        ? { width: Number(values.size_width), height: Number(values.size_height) }
        : null;

    onSubmit({
      full_name: values.full_name.trim(),
      position: values.position.trim(),
      department_id: values.department_id.trim(),
      description: values.description?.trim() || null,
      avatar_url: values.avatar_url?.trim() || null,
      color: values.color?.trim() || null,
      size,
    });
    onOpenChange(false);
  };

  const isEditing = !!initialData;

  const dialogTitle = isEditing
    ? 'Chỉnh sửa thông tin nhân sự'
    : 'Thêm nhân sự mới';

  const dialogDesc = isEditing
    ? 'Cập nhật lại thông tin cá nhân hoặc chức vụ của nhân sự này.'
    : 'Điền thông tin để thêm nhân sự mới vào sơ đồ tổ chức.';

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isImagePickerOpen) {
      setIsImagePickerOpen(false);
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange} modal={!isImagePickerOpen}>
      <DialogContent
        className="sm:max-w-[1000px] overflow-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
        onInteractOutside={(event) => {
          if (isImagePickerOpen) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isImagePickerOpen) {
            event.preventDefault();
            setIsImagePickerOpen(false);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDesc}</DialogDescription>
        </DialogHeader>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức vụ / Vị trí</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: Trưởng phòng Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng ban / Khối</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban / khối" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả ngắn về vị trí này" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsImagePickerOpen(true)}
                      >
                        Chọn từ thư viện ảnh
                      </Button>

                      {!!field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            field.onChange('');
                            setSelectedAvatarId(undefined);
                          }}
                        >
                          Xóa ảnh
                        </Button>
                      )}
                    </div>

                    {!!field.value && (
                      <div className="flex items-center gap-3 rounded-md border p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveAvatarSrc(field.value) || ''}
                          alt="Avatar preview"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-full border object-cover"
                        />
                        <p className="text-xs text-gray-600 break-all">{field.value}</p>
                      </div>
                    )}

                    <FormControl>
                      <Input
                        placeholder="https://... hoặc /uploads/..."
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />

                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu nền node</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          className="h-10 w-14 cursor-pointer rounded border p-1"
                          {...field}
                          value={field.value || '#F4A261'}
                        />
                        <Input
                          placeholder="#F4A261"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size_width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều rộng (px)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={60}
                          max={3000}
                          step={10}
                          value={Number(field.value) || 180}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="flex-1 h-2 cursor-pointer accent-blue-600"
                        />
                        <span className="w-14 text-right text-sm font-medium text-gray-700 tabular-nums">
                          {Number(field.value) || 180} px
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size_height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chiều cao (px)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={60}
                          max={3000}
                          step={10}
                          value={Number(field.value) || 90}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="flex-1 h-2 cursor-pointer accent-blue-600"
                        />
                        <span className="w-14 text-right text-sm font-medium text-gray-700 tabular-nums">
                          {Number(field.value) || 90} px
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {isEditing ? 'Lưu thay đổi' : 'Thêm nhân sự'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <ImagePicker
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={handleSelectAvatar}
        selectedFileId={selectedAvatarId}
        type="image"
      />
    </Dialog>
  );
}
