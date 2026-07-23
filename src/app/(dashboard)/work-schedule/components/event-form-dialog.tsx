'use client';

import React, { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { WorkEvent, WorkScheduleMutate } from '@/types/work-schedule';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

function isoToDateTimeLocal(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const match = isoString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return match ? match[1] : '';
}

const eventSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  tasks: z.string().min(1, 'Vui lòng nhập Công tác chuẩn bị'),
  host: z.string().optional(),
  participants: z.string().optional(),
  schedule_time: z.string().min(1, 'Vui lòng chọn ngày và giờ'),
  end_time: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WorkScheduleMutate, originalEvent?: WorkEvent) => void;
  initialData?: WorkEvent | null;
  selectedDate?: Date;
  isSubmitting?: boolean;
}

export function EventFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  selectedDate,
  isSubmitting = false,
}: EventFormDialogProps) {
  const defaultScheduleTime = selectedDate
    ? format(selectedDate, "yyyy-MM-dd'T'HH:mm")
    : format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      tasks: '',
      host: '',
      participants: '',
      schedule_time: defaultScheduleTime,
      end_time: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const raw = initialData as unknown as Record<string, unknown>;
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        tasks: (raw.tasks as string) || '',
        host: (raw.host as string) || '',
        participants: (raw.participants as string) || '',
        schedule_time: isoToDateTimeLocal(raw.schedule_time as string) || defaultScheduleTime,
        end_time: isoToDateTimeLocal(raw.end_time as string) || '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        tasks: '',
        host: '',
        participants: '',
        schedule_time: defaultScheduleTime,
        end_time: '',
      });
    }
  }, [open, initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: EventFormValues) => {
    const payload: WorkScheduleMutate = {
      title: values.title,
      description: values.description || '',
      tasks: values.tasks,
      host: values.host || '',
      participants: values.participants || '',
      schedule_time: values.schedule_time,
      end_time: values.end_time || null,
    } as unknown as WorkScheduleMutate;

    onSubmit(payload, initialData ?? undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-auto max-h-screen border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? 'Cập nhật lịch công tác' : 'Thêm lịch công tác mới'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Cập nhật thông tin sự kiện hoặc cuộc họp bên dưới.'
              : 'Điền các thông tin chi tiết về sự kiện hoặc cuộc họp bên dưới.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            {/* Tiêu đề */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Họp giao ban" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Công tác chuẩn bị */}
            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Công tác chuẩn bị</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả công việc cần thực hiện..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày & Giờ bắt đầu */}
            <FormField
              control={form.control}
              name="schedule_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày & Giờ bắt đầu</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thời gian kết thúc */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian kết thúc (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả nội dung */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả nội dung</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Chi tiết cuộc họp..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Người chủ trì */}
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người chủ trì</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người chủ trì" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Người tham gia */}
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người tham gia</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Nguyễn Văn A, Trần Thị B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : initialData ? (
                  'Lưu thay đổi'
                ) : (
                  'Thêm sự kiện'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
