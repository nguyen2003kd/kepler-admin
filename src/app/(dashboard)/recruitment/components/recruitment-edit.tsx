"use client"

import React, { useState, useEffect } from "react"
import type { Recruitment } from "@/api/models/recruitment"
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
import { useGetApiV10FileId } from "@/api/endpoints/file"

interface RecruitmentEditProps {
  recruitment: Recruitment | null
  open: boolean
  onClose: () => void
  onSubmit: (values: RecruitmentMutate) => Promise<void>
}

export const RecruitmentEdit: React.FC<RecruitmentEditProps> = ({
  recruitment,
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<RecruitmentMutate>({
    title: "",
    description: null,
    requirements: null,
    benefits: null,
    experience: null,
    employment_type: null,
    file_id: null,
    location: null,
    salary_min: null,
    salary_max: null,
    quantity: null,
    deadline: null,
    is_active: true,
    required_documents: null,
  })
  const [saving, setSaving] = useState(false)
  const [filePickerOpen, setFilePickerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ImagePickerFile | null>(null)

  const fileId = recruitment?.file_id ?? null

  const { data: fileData } = useGetApiV10FileId(fileId ?? "", {
    query: { enabled: !!fileId },
  })

  // Sync selectedFile when fileData changes (file fetched)
  useEffect(() => {
    if (fileData?.responseData) {
      const f = fileData.responseData
      setSelectedFile({
        id: f.id ?? "",
        path: f.path ?? "",
        name: f.name ?? "",
        title: f.title ?? "",
        mime: f.mime ?? "",
        size: f.size ? String(f.size) : "",
      })
    } else if (!fileId && !recruitment?.file_id) {
      setSelectedFile(null)
    }
  }, [fileData, fileId, recruitment?.file_id])

  // Reset selectedFile when switching to a different recruitment without file
  useEffect(() => {
    if (recruitment && !recruitment.file_id) {
      setSelectedFile(null)
    }
  }, [recruitment])

  // Sync values when recruitment changes
  useEffect(() => {
    if (!recruitment) return
    setValues({
      title: recruitment.title ?? "",
      description: recruitment.description ?? null,
      requirements: recruitment.requirements ?? null,
      benefits: recruitment.benefits ?? null,
      experience: recruitment.experience ?? null,
      employment_type: recruitment.employment_type ?? null,
      file_id: recruitment.file_id ?? null,
      location: recruitment.location ?? null,
      salary_min: recruitment.salary_min
        ? Number(recruitment.salary_min)
        : null,
      salary_max: recruitment.salary_max
        ? Number(recruitment.salary_max)
        : null,
      quantity: recruitment.quantity ?? null,
      deadline: recruitment.deadline
        ? String(recruitment.deadline).slice(0, 10)
        : null,
      is_active: recruitment.is_active ?? true,
      required_documents: recruitment.required_documents ?? null,
    })
  }, [recruitment])

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
      onClose()
    } catch {
      // error handled in page
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setFilePickerOpen(false)
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
          <DialogTitle>Chỉnh sửa tin tuyển dụng</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa tin tuyển dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Vị trí tuyển dụng */}
              <div>
                <Label htmlFor="title-e">
                  Vị trí tuyển dụng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title-e"
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
                <Label htmlFor="location-e">Địa điểm</Label>
                <Input
                  id="location-e"
                  placeholder="VD: Đà Nẵng"
                  value={values.location ?? ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Kinh nghiệm */}
              <div>
                <Label htmlFor="experience-e">Kinh nghiệm</Label>
                <Input
                  id="experience-e"
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

              {/* Loại hình việc làm */}
              <div>
                <Label htmlFor="employment_type-e">Loại hình việc làm</Label>
                <Input
                  id="employment_type-e"
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

              {/* Mức lương */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min-e">Mức lương tối thiểu (VND)</Label>
                  <Input
                    id="salary_min-e"
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
                  <Label htmlFor="salary_max-e">Mức lương tối đa (VND)</Label>
                  <Input
                    id="salary_max-e"
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

              {/* Số lượng */}
              <div>
                <Label htmlFor="quantity-e">Số lượng tuyển</Label>
                <Input
                  id="quantity-e"
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
                <Label htmlFor="deadline-e">Hạn nộp</Label>
                <Input
                  id="deadline-e"
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
                <Label htmlFor="description-e">Mô tả công việc</Label>
                <Textarea
                  id="description-e"
                  placeholder="Mô tả chi tiết công việc..."
                  value={values.description ?? ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Yêu cầu */}
              <div>
                <Label htmlFor="requirements-e">Yêu cầu đối với ứng viên</Label>
                <Textarea
                  id="requirements-e"
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
                <Label htmlFor="benefits-e">Quyền lợi</Label>
                <Textarea
                  id="benefits-e"
                  placeholder="Các quyền lợi khi gia nhập..."
                  value={values.benefits ?? ""}
                  onChange={(e) => handleChange("benefits", e.target.value)}
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div>

              {/* Hồ sơ dự tuyển */}
              <div>
                <Label htmlFor="required_documents-e">Hồ sơ dự tuyển</Label>
                <Textarea
                  id="required_documents-e"
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
                          {selectedFile.title || selectedFile.name || "File đã chọn"}
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
                  id="is_active-e"
                  checked={values.is_active ?? true}
                  onCheckedChange={(checked) =>
                    handleChange("is_active", checked)
                  }
                />
                <Label htmlFor="is_active-e" className="cursor-pointer">
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
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
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
