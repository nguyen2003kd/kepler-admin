"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface ContactViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    name?: string;
    email?: string;
    phone_number?: string;
    content?: string;
    created_at?: string;
  } | null;
}

export function ContactViewDialog({
  open,
  onOpenChange,
  contact,
}: ContactViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chi tiết liên hệ
          </DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết của liên hệ
          </DialogDescription>
        </DialogHeader>
        {contact && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">
                  Tên người liên hệ
                </Label>
                <p className="mt-1">{contact.name}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Email</Label>
                <p className="mt-1">{contact.email}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Số điện thoại</Label>
                <p className="mt-1">
                  {contact.phone_number || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Ngày tạo</Label>
                <p className="mt-1">
                  {contact.created_at
                    ? new Date(contact.created_at).toLocaleString("vi-VN")
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>
            {contact.content && (
              <div>
                <Label className="text-sm font-semibold">Tin nhắn</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{contact.content}</p>
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
