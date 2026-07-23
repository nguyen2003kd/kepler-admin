"use client"

import React, { useState, useEffect } from "react"
import type { Candidate } from "@/api/models/candidate"
import type { CandidateMutate } from "@/api/models/candidateMutate"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CandidateEditProps {
  candidate: Candidate | null
  open: boolean
  onClose: () => void
  onSubmit: (id: string, values: CandidateMutate) => Promise<void>
}

export const CandidateEdit: React.FC<CandidateEditProps> = ({
  candidate,
  open,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<CandidateMutate>({
    recruitment_id: "",
    position: null,
    full_name: "",
    address: "",
    email: "",
    phone: "",
    language_proficiency: null,
    it_proficiency: null,
    education_level: null,
    major: null,
    cv_url: null,
    cover_letter: null,
    status: null,
    note: null,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (candidate) {
      const rawStatus = candidate.status ?? null
      const normalizedStatus = rawStatus?.trim().toLowerCase() ?? null

      const mappedStatus =
        normalizedStatus === "pending"
          ? "pending"
          : normalizedStatus === "accepted" || normalizedStatus === "approved"
          ? "ACCEPTED"
          : normalizedStatus === "reject" || normalizedStatus === "rejected"
          ? "REJECTED"
          : rawStatus

      setValues({
        recruitment_id: candidate.recruitment_id ?? "",
        position: candidate.position ?? null,
        full_name: candidate.full_name ?? "",
        address: candidate.address ?? "",
        email: candidate.email ?? "",
        phone: candidate.phone ?? "",
        language_proficiency: candidate.language_proficiency ?? null,
        it_proficiency: candidate.it_proficiency ?? null,
        education_level: candidate.education_level ?? null,
        major: candidate.major ?? null,
        cv_url: candidate.cv_url ?? null,
        cover_letter: candidate.cover_letter ?? null,
        status: mappedStatus ?? null,
        note: candidate.note ?? null,
      })
    }
  }, [candidate])

  const handleChange = (
    field: keyof CandidateMutate,
    raw: string | null
  ) => {
    setValues((prev) => ({ ...prev, [field]: raw }))
  }

  const handleSave = async () => {
    if (!candidate?.id || !values.full_name?.trim() || !values.address?.trim()) return
    setSaving(true)
    try {
      await onSubmit(candidate.id, values)
      onClose()
    } catch {
      // error handled in page
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ứng viên</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa thông tin ứng viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recruitment ID */}
              <div>
                {/* <Label htmlFor="c-recruitment_id">Recruitment ID</Label>
                <Input
                  id="c-recruitment_id"
                  value={values.recruitment_id}
                  disabled
                  className="mt-1"
                /> */}
              </div>

              {/* Họ và tên */}
              <div>
                <Label htmlFor="c-full_name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="c-full_name"
                  placeholder="VD: Nguyễn Văn A"
                  value={values.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  maxLength={255}
                  className="mt-1"
                />
              </div>

              {/* Vị trí */}
              <div>
                <Label htmlFor="c-position">Vị trí tuyển dụng</Label>
                <Input
                  id="c-position"
                  placeholder="VD: Nhân viên kinh doanh"
                  value={values.position ?? ""}
                  onChange={(e) => handleChange("position", e.target.value || null)}
                  maxLength={255}
                  className="mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  placeholder="a@example.com"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <Label htmlFor="c-phone">Số điện thoại</Label>
                <Input
                  id="c-phone"
                  placeholder="0901234567"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  maxLength={20}
                  className="mt-1"
                />
              </div>

              {/* Địa chỉ */}
              <div>
                <Label htmlFor="c-address">
                  Địa chỉ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="c-address"
                  placeholder="VD: Đà Nẵng"
                  value={values.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Trình độ học vấn & Chuyên môn */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-education_level">Trình độ học vấn</Label>
                  <Input
                    id="c-education_level"
                    placeholder="VD: Đại học"
                    value={values.education_level ?? ""}
                    onChange={(e) => handleChange("education_level", e.target.value || null)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="c-major">Chuyên môn</Label>
                  <Input
                    id="c-major"
                    placeholder="VD: Công nghệ thông tin"
                    value={values.major ?? ""}
                    onChange={(e) => handleChange("major", e.target.value || null)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Ngoại ngữ & Tin học */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-language_proficiency">Ngoại ngữ</Label>
                  <Input
                    id="c-language_proficiency"
                    placeholder="VD: IELTS 6.5"
                    value={values.language_proficiency ?? ""}
                    onChange={(e) =>
                      handleChange("language_proficiency", e.target.value || null)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="c-it_proficiency">Tin học</Label>
                  <Input
                    id="c-it_proficiency"
                    placeholder="VD: Mos Word/Excel"
                    value={values.it_proficiency ?? ""}
                    onChange={(e) =>
                      handleChange("it_proficiency", e.target.value || null)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <Label htmlFor="c-status">Trạng thái</Label>
                <div className="mt-1">
                  <Select
                    value={values.status ?? undefined}
                    onValueChange={(value) => handleChange("status", value || null)}
                  >
                    <SelectTrigger id="c-status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACCEPTED">Chấp nhận</SelectItem>
                      <SelectItem value="pending">Đang xử lý</SelectItem>
                      <SelectItem value="REJECTED">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* CV URL */}
              {/* <div>
                <Label htmlFor="c-cv_url">CV URL</Label>
                <Input
                  id="c-cv_url"
                  placeholder="https://..."
                  value={values.cv_url ?? ""}
                  onChange={(e) => handleChange("cv_url", e.target.value || null)}
                  className="mt-1"
                />
              </div> */}

              {/* Cover letter */}
              {/* <div>
                <Label htmlFor="c-cover_letter">Thư xin việc</Label>
                <Textarea
                  id="c-cover_letter"
                  placeholder="Nội dung thư xin việc..."
                  value={values.cover_letter ?? ""}
                  onChange={(e) => handleChange("cover_letter", e.target.value || null)}
                  rows={4}
                  className="mt-1 resize-none"
                />
              </div> */}

              {/* Ghi chú */}
              {/* <div>
                <Label htmlFor="c-note">Ghi chú</Label>
                <Textarea
                  id="c-note"
                  placeholder="Ghi chú thêm..."
                  value={values.note ?? ""}
                  onChange={(e) => handleChange("note", e.target.value || null)}
                  rows={2}
                  className="mt-1 resize-none"
                />
              </div> */}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={saving || !values.full_name?.trim() || !values.address?.trim()}
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
