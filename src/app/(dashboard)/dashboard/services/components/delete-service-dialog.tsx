'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

import type { Service } from '../lib/types';
import { generateServiceDisplayName } from '../lib/utils';

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  service: Service | null;
  isLoading?: boolean;
}

export default function DeleteServiceDialog({
  isOpen,
  onClose,
  onConfirm,
  service,
  isLoading = false,
}: DeleteServiceDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling done in parent
      console.error('Delete confirmation error:', error);
    }
  };

  const canDelete = service?.status === 'inactive';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {canDelete ? 'Xác nhận xóa dịch vụ' : 'Không thể xóa dịch vụ'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {canDelete ? (
              <>
                Bạn có chắc chắn muốn xóa dịch vụ{' '}
                <span className="font-medium">
                  {service && generateServiceDisplayName(service, true)}
                </span>
                ? Hành động này không thể hoàn tác.
              </>
            ) : (
              <>
                Không thể xóa dịch vụ{' '}
                <span className="font-medium">
                  {service && generateServiceDisplayName(service, true)}
                </span>{' '}
                vì dịch vụ đang ở trạng thái hoạt động. Vui lòng ngừng hoạt động 
                dịch vụ trước khi xóa.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {canDelete ? 'Hủy' : 'Đóng'}
          </AlertDialogCancel>
          {canDelete && (
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa dịch vụ
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}