"use client"

import React, { useState, useRef, useEffect } from "react"
import { Download, Eye, FileText, Loader2, MoreHorizontal} from "lucide-react"
import type { Candidate } from "@/api/models/candidate"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toaster"
import { extractErrorMessage } from "@/utils/error"
import {
  useCandidateFiles,
  useRemoveFileFromCandidate,
  type CandidateFileRow,
} from "@/hooks/useCandidateFiles"
import { FileEdit } from "@/app/(dashboard)/list-file/components/file-edit"
import baseConfig from "@/configs/base"

interface CandidateDetailProps {
  candidate: Candidate | null
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

const FileItem: React.FC<{
  item: CandidateFileRow
  onEdit: (item: CandidateFileRow) => void
  onDelete: (fileId: string) => void
  isDeleting: boolean
}> = ({ item }) => {
  const file = item.file
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isPdf = file?.mime?.includes("pdf")
  const fileName = file?.name || "Tệp không tên"
  const filePath = file?.path
  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all group relative">
      <div className="flex-shrink-0">
        {isPdf ? (
          <FileText className="h-5 w-5 text-red-500" />
        ) : (
          <FileText className="h-5 w-5 text-blue-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-gray-900 truncate"
          title={fileName}
        >
          {fileName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {file?.mime && (
            <span className="text-xs text-gray-400 uppercase">
              {file.mime.split("/")[1]}
            </span>
          )}
          {formattedDate && (
            <>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-400">{formattedDate}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          title="Tùy chọn"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-40 overflow-hidden">
            <button
              onClick={() => {
                if (filePath) {
                  window.open(
                    `${baseConfig.imgEndpointDomain}${filePath}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                setOpen(false)
              }}
              disabled={!filePath}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eye className="h-4 w-4" />
              Xem
            </button>
            <button
              onClick={() => {
                if (filePath) {
                  const link = document.createElement("a")
                  link.href = `${baseConfig.imgEndpointDomain}${filePath}`
                  link.download = fileName
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
                setOpen(false)
              }}
              disabled={!filePath}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </button>
            <div className="border-t border-gray-100" />

          </div>
        )}
      </div>
    </div>
  )
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({
  candidate,
  open,
  onClose,
}) => {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
  const [editingFile, setEditingFile] = useState<CandidateFileRow | null>(null)

  const { data: files = [], isLoading: isFilesLoading } = useCandidateFiles({
    candidateId: candidate?.id,
    enabled: open,
  })

  const removeMutation = useRemoveFileFromCandidate(candidate?.id ?? "")

  const handleDeleteFile = async (fileId: string) => {
    if (!candidate?.id) return
    setDeletingFileId(fileId)
    try {
      await removeMutation.mutateAsync(fileId)
      toast.success({ title: "Thành công", content: "Đã xóa file khỏi ứng viên" })
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error({ title: "Xóa thất bại", content: msg })
    } finally {
      setDeletingFileId(null)
    }
  }

  if (!candidate) return null

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Chi tiết ứng viên</DialogTitle>
            </div>
          </DialogHeader>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{candidate.full_name ?? "—"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow label="Email" value={candidate.email} />
              <DetailRow label="Số điện thoại" value={candidate.phone} />
              <DetailRow label="Vị trí tuyển dụng" value={candidate.position} />
              <DetailRow label="Địa chỉ" value={candidate.address} />
              <Separator />
              <DetailRow label="Trình độ học vấn" value={candidate.education_level} />
              <DetailRow label="Chuyên môn" value={candidate.major} />
              <DetailRow label="Ngoại ngữ" value={candidate.language_proficiency} />
              <DetailRow label="Tin học" value={candidate.it_proficiency} />
              <Separator />
              <div className="flex gap-3 items-center">
                <span className="w-36 flex-shrink-0 text-sm font-medium text-gray-500">
                  Trạng thái
                </span>
                {(() => {
                  const raw = candidate.status ?? ""
                  const normalized = raw.trim().toLowerCase()
                  const { label, className } =
                    normalized === "pending"
                      ? {
                          label: "Đang xử lý",
                          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
                        }
                      : normalized === "accepted" || normalized === "approved"
                      ? {
                          label: "Chấp nhận",
                          className: "bg-green-50 text-green-700 border-green-200",
                        }
                      : normalized === "reject" || normalized === "rejected"
                      ? {
                          label: "Từ chối",
                          className: "bg-red-50 text-red-600 border-red-200",
                        }
                      : {
                          label: raw || "—",
                          className: "bg-gray-50 text-gray-600 border-gray-200",
                        }
                  return (
                    <Badge variant="outline" className={className}>
                      {label}
                    </Badge>
                  )
                })()}
              </div>
              {/* <DetailRow label="Ghi chú" value={candidate.note} />
              {candidate.cv_url && (
                <div className="flex gap-3">
                  <span className="w-36 flex-shrink-0 text-sm font-medium text-gray-500">
                    CV
                  </span>
                  <a
                    href={candidate.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Xem CV
                  </a>
                </div>
              )} */}
              {/* {candidate.cover_letter && (
                <>
                  <Separator />
                  <div>
                    <span className="w-36 flex-shrink-0 text-sm font-medium text-gray-500 block mb-1">
                      Thư xin việc
                    </span>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                      {candidate.cover_letter}
                    </p>
                  </div>
                </>
              )} */}
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Hồ sơ ứng tuyển
              </h3>
              {isFilesLoading && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
              )}
              {!isFilesLoading && files.length > 0 && (
                <span className="text-xs text-gray-400">{files.length} tệp</span>
              )}
            </div>

            {isFilesLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-lg bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Chưa có tệp đính kèm</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((item) => (
                  <FileItem
                    key={item.id}
                    item={item}
                    onEdit={setEditingFile}
                    onDelete={handleDeleteFile}
                    isDeleting={deletingFileId === item.file_id}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {editingFile?.file && (
        <FileEdit
          fileItem={editingFile.file}
          onClose={() => setEditingFile(null)}
          onSuccess={() => setEditingFile(null)}
        />
      )}
    </>
  )
}
