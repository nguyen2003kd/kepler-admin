"use client"

import React, { useState } from "react"
import type { Service } from "@/api/models/service"
import type { ServiceMutate } from "@/api/models/serviceMutate"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface ServiceEditProps {
  service: Service | null
  open: boolean
  onClose: () => void
  onSubmit: (values: ServiceMutate) => Promise<void>
}

export const ServiceEdit: React.FC<ServiceEditProps> = ({
  service,
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<ServiceMutate>({
    name: service?.name ?? "",
  })
  const [saving, setSaving] = useState(false)

  // Reset when service changes
  React.useEffect(() => {
    if (service) {
      setValues({ name: service.name ?? "" })
    }
  }, [service])

  const handleSave = async () => {
    if (!values.name.trim()) return
    setSaving(true)
    try {
      await onSubmit(values)
      onClose()
    } catch {
      // error handled in page
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setValues({ name: "" })
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập tên dịch vụ"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  maxLength={255}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {values.name.length} / 255 ký tự
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !values.name.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
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
