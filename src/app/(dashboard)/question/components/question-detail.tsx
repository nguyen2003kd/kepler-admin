"use client"

import React from "react"
import type { Question } from "@/api/models/question"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface QuestionDetailProps {
  item: Question | null
  open: boolean
  onClose: () => void
}

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({
  label,
  value,
}) => (
  <div className="flex gap-3">
    <span className="w-36 flex-shrink-0 text-sm font-medium text-gray-500">
      {label}
    </span>
    <span className="text-sm text-gray-900">{value || "—"}</span>
  </div>
)

export const QuestionDetail: React.FC<QuestionDetailProps> = ({
  item,
  open,
  onClose,
}) => {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết liên hệ</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{item.name ?? "—"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Số điện thoại" value={item.phone_number} />
            <DetailRow label="Email" value={item.email} />
            <DetailRow label="Địa chỉ" value={item.address} />
            <DetailRow label="Chuyên môn" value={item.major} />
            <Separator />
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">
                Nội dung câu hỏi
              </span>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                {item.question || "—"}
              </p>
            </div>
            <Separator />
            <DetailRow label="Ngày tạo" value={item.created_at} />
            <DetailRow label="Cập nhật" value={item.updated_at ?? "—"} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
