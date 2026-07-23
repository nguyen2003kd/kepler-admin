"use client"

import React, { useEffect, useState } from "react"
import type { Question } from "@/api/models/question"
import type { QuestionMutate } from "@/api/models/questionMutate"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface QuestionEditProps {
  item: Question | null
  open: boolean
  onClose: () => void
  onSubmit: (id: string, values: QuestionMutate) => Promise<void>
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({
  item,
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<QuestionMutate>({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    major: "",
    question: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setValues({
        name: item.name ?? "",
        phone_number: item.phone_number ?? "",
        email: item.email ?? "",
        address: item.address ?? "",
        major: item.major ?? "",
        question: item.question ?? "",
      })
    }
  }, [item])

  const handleChange = (field: keyof QuestionMutate, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!item?.id) return
    setSaving(true)
    try {
      await onSubmit(item.id, values)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa liên hệ</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="q-name">Họ và tên</Label>
                <Input
                  id="q-name"
                  value={values.name ?? ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="q-phone">Số điện thoại</Label>
                  <Input
                    id="q-phone"
                    value={values.phone_number ?? ""}
                    onChange={(e) => handleChange("phone_number", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="q-email">Email</Label>
                  <Input
                    id="q-email"
                    type="email"
                    value={values.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="q-address">Địa chỉ</Label>
                <Input
                  id="q-address"
                  value={values.address ?? ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="q-major">Chuyên môn</Label>
                <Input
                  id="q-major"
                  value={values.major ?? ""}
                  onChange={(e) => handleChange("major", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="q-question">Nội dung câu hỏi</Label>
                <Textarea
                  id="q-question"
                  value={values.question ?? ""}
                  onChange={(e) => handleChange("question", e.target.value)}
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={saving}>
                Hủy bỏ
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
