"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/hooks/use-modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  onCancel,
  confirmText = "Continue",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmModalProps) {
  const { isOpen, modalType, modalData, closeModal } = useModalStore();

  const isConfirmModal = isOpen && modalType === "confirm";

  const modalProps = (modalData as ConfirmModalProps) || {};
  const finalTitle = modalProps.title || title;
  const finalDescription = modalProps.description || description;
  const finalConfirmText = modalProps.confirmText || confirmText;
  const finalCancelText = modalProps.cancelText || cancelText;
  const finalVariant = modalProps.variant || variant;
  const finalOnConfirm = modalProps.onConfirm || onConfirm;
  const finalOnCancel = modalProps.onCancel || onCancel;

  const handleConfirm = () => {
    finalOnConfirm?.();
    closeModal();
  };

  const handleCancel = () => {
    finalOnCancel?.();
    closeModal();
  };

  return (
    <Dialog
      open={isConfirmModal}
      onOpenChange={(open) => !open && closeModal()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {finalVariant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {finalTitle}
          </DialogTitle>
          <DialogDescription>{finalDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            {finalCancelText}
          </Button>
          <Button
            variant={finalVariant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use the confirm modal easily
export function useConfirmModal() {
  const { openModal } = useModalStore();

  const confirm = (props: Omit<ConfirmModalProps, "onConfirm">) => {
    return new Promise<boolean>((resolve) => {
      const modalProps = {
        ...props,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      };
      openModal("confirm", modalProps);
    });
  };

  return { confirm };
}
