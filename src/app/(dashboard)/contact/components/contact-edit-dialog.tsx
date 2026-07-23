"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContactMutate } from "@/api/models";

interface ContactEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ContactMutate;
  onFormChange: (data: ContactMutate) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function ContactEditDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  isPending,
}: ContactEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa liên hệ</DialogTitle>
          <DialogDescription>Cập nhật thông tin liên hệ</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Tên người liên hệ *</Label>
            <Input
              id="edit-name"
              placeholder="Nhập tên người liên hệ"
              value={formData.name}
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) =>
                onFormChange({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Số điện thoại</Label>
            <Input
              id="edit-phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone_number}
              onChange={(e) =>
                onFormChange({ ...formData, phone_number: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-message">Tin nhắn</Label>
            <Textarea
              id="edit-message"
              placeholder="Nhập tin nhắn"
              value={formData.content}
              onChange={(e) =>
                onFormChange({ ...formData, content: e.target.value })
              }
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!formData.name || !formData.email || isPending}
          >
            {isPending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
