"use client"

import React, { useState } from "react"
import type { RecruitmentMutate } from "@/api/models/recruitmentMutate"
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
import { Switch } from "@/components/ui/switch"
import { Loader2, FileText, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ImagePicker } from "@/components/shared/image-picker"
import type { ImagePickerFile } from "@/components/shared/image-picker"

interface RecruitmentCreateProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: RecruitmentMutate) => Promise<void>
}

const EMPTY: RecruitmentMutate = {
  title: "",
  description: null,
  requirements: null,
  benefits: null,
  experience: null,
  employment_type: null,
  file_id: null,
  location: "",
  salary_min: null,
  salary_max: null,
  quantity: null,
  deadline: null,
  is_active: true,
  required_documents: null,
}

export const RecruitmentCreate: React.FC<RecruitmentCreateProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<RecruitmentMutate>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filePickerOpen, setFilePickerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ImagePickerFile | null>(null)

  const handleChange = (
    field: keyof RecruitmentMutate,
    raw: string | boolean | number | null
  ) => {
    setValues((prev) => ({ ...prev, [field]: raw }))
  }

  const handleSave = async () => {
    if (!values.title?.trim()) return
    setSaving(true)
    try {
      await onSubmit(values)
      setValues(EMPTY)
      setFilePickerOpen(false)
      setSelectedFile(null)
      onClose()
    } catch {
      // error handled in page
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setValues(EMPTY)
      setFilePickerOpen(false)
      setSelectedFile(null)
      onClose()
    }
  }

  const fmt = (v: string) =>
    v ? Number(v).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) : ""

  const handleFileSelect = (file: ImagePickerFile) => {
    setSelectedFile(file)
    handleChange("file_id", file.id)
    setFilePickerOpen(false)
  }

  const handleFileClear = () => {
    setSelectedFile(null)
    handleChange("file_id", null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm tin tuyển dụng mới</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Tạo tin tuyển dụng mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Vị trí tuyển dụng */}
              <div>
                <Label htmlFor="title">
                  Vị trí tuyển dụng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="VD: Backend Developer"
                  value={values.title ?? ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  maxLength={255}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(values.title ?? "").length} / 255 ký tự
                </p>
              </div>

              {/* Địa điểm */}
              <div>
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  placeholder="VD: Đà Nẵng"
                  value={values.location ?? ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Kinh nghiệm */}
              <div>
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Input
                  id="experience"
                  placeholder="VD: 3+ năm, 5 năm"
                  value={values.experience ?? ""}
                  onChange={(e) => handleChange("experience", e.target.value || null)}
                  maxLength={255}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(values.experience ?? "").length} / 255 ký tự
                </p>
              </div>
              {/* Mức lương */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min">Mức lương thiểu (VND)</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    placeholder="VD: 10000000"
                    value={values.salary_min ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "salary_min",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    min={0}
                    className="mt-1"
                  />
                  {values.salary_min && (
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ {fmt(String(values.salary_min))} VNĐ
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="salary_max">Mức lương tối đa (VND)</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    placeholder="VD: 20000000"
                    value={values.salary_max ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "salary_max",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    min={0}
                    className="mt-1"
                  />
                  {values.salary_max && (
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ {fmt(String(values.salary_max))} VNĐ
                    </p>
                  )}
                </div>
              </div>
              {/* Loại hình việc làm */}
              <div>
                <Label htmlFor="employment_type">Loại hình việc làm</Label>
                <Input
                  id="employment_type"
                  placeholder="VD: Toàn thời gian, Bán thời gian, Hợp đồng..."
                  value={values.employment_type ?? ""}
                  onChange={(e) => handleChange("employment_type", e.target.value || null)}
                  maxLength={255}
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {(values.employment_type ?? "").length} / 255 ký tự
                </p>
              </div>


              {/* Số lượng */}
              <div>
                <Label htmlFor="quantity">Số lượng tuyển</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="VD: 2"
                  value={values.quantity ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "quantity",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  min={1}
                  className="mt-1"
                />
              </div>

              {/* Hạn nộp */}
              <div>
                <Label htmlFor="deadline">Hạn nộp</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={
                    values.deadline
                      ? String(values.deadline).slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "deadline",
                      e.target.value
                        ? `${e.target.value}T00:00:00.000Z`
                        : null
                    )
                  }
                  className="mt-1"
                />
              </div>

              {/* Mô tả */}
              <div>
                <Label htmlFor="description">Mô tả công việc</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết công việc..."
                  value={values.description ?? ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Yêu cầu */}
              <div>
                <Label htmlFor="requirements">Yêu cầu đối với ứng viên</Label>
                <Textarea
                  id="requirements"
                  placeholder="Yêu cầu về kỹ năng, kinh nghiệm..."
                  value={values.requirements ?? ""}
                  onChange={(e) =>
                    handleChange("requirements", e.target.value)
                  }
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Quyền lợi */}
              <div>
                <Label htmlFor="benefits">Quyền lợi</Label>
                <Textarea
                  id="benefits"
                  placeholder="Các quyền lợi khi gia nhập..."
                  value={values.benefits ?? ""}
                  onChange={(e) => handleChange("benefits", e.target.value)}
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Hồ sơ dự tuyển */}
              <div>
                <Label htmlFor="required_documents">Hồ sơ dự tuyển</Label>
                <Textarea
                  id="required_documents"
                  placeholder="VD: CV, CMND/CCCD, Bằng cấp, Giấy khám sức khỏe..."
                  value={values.required_documents ?? ""}
                  onChange={(e) =>
                    handleChange("required_documents", e.target.value)
                  }
                  rows={2}
                  className="mt-1 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Liệt kê các tài liệu ứng viên cần chuẩn bị khi ứng tuyển
                </p>
              </div>

              {/* File đính kèm */}
              <div>
                <Label>Thông báo tuyển dụng</Label>
                <div className="mt-1">
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {selectedFile.title || selectedFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileClear}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFilePickerOpen(true)}
                      className="w-full justify-start text-gray-500"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Chọn file từ thư viện
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  File JD hoặc tài liệu liên quan đến tin tuyển dụng
                </p>
              </div>

              {/* Trạng thái */}
              <div className="flex items-center gap-3 pt-2">
                <Switch
                  id="is_active"
                  checked={values.is_active ?? true}
                  onCheckedChange={(checked) =>
                    handleChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Đang tuyển dụng
                </Label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !values.title?.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={saving}
              >
                Hủy bỏ
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
    <ImagePicker
      isOpen={filePickerOpen}
      onClose={() => setFilePickerOpen(false)}
      onSelect={handleFileSelect}
      type="file"
      selectedFileId={values.file_id ?? undefined}
    />
    </>
  )
}
