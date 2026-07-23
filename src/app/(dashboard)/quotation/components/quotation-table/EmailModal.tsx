"use client";

import React from "react";
import { Mail, X, FileText } from "lucide-react";
import { useAbility } from "@/hooks/use-ability";
import type { EmailModalState, QuotationRow } from "./types";
import { getString, getNestedObj } from "./utils";

interface EmailModalProps {
  modalState: EmailModalState;
  statusRows: QuotationRow[];
  onClose: () => void;
  onPriceChange: (price: string) => void;
  onStatusChange: (status: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onSendEmail: () => void;
  confirmState: boolean;
  onConfirm: () => void;
  onCancelConfirm: () => void;
  ConfirmDialog: React.ComponentType<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  modalState,
  statusRows,
  onClose,
  onPriceChange,
  onStatusChange,
  onFileSelect,
  onRemoveFile,
  onSendEmail,
  confirmState,
  onConfirm,
  onCancelConfirm,
  ConfirmDialog,
}) => {
  const ability = useAbility();
  const canAddAttachment = ability.can("add_attachment", "quotation");

  if (!modalState.open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Gửi email báo giá</h2>
                </div>
                <p className="text-emerald-100 text-sm flex items-center gap-1.5">
                  <span>📧</span>
                  {getString(modalState.quotation ?? {}, "email")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-3xl"></div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Customer Info Card */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {getString(modalState.quotation ?? {}, "name")
                    .charAt(0)
                    .toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {getString(modalState.quotation ?? {}, "name")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getString(modalState.quotation ?? {}, "organization_name") ||
                      "Cá nhân"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-white rounded-full text-gray-600 font-mono shadow-sm border border-gray-200">
                  📋 {getString(modalState.quotation ?? {}, "code")}
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 rounded-full text-emerald-700 font-medium border border-emerald-200">
                  {getString(
                    getNestedObj(modalState.quotation ?? {}, "quotation_status"),
                    "name",
                  ) || "Mới tạo"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                Mô tả yêu cầu
              </label>
              <textarea
                value={
                  getString(modalState.quotation ?? {}, "description") ||
                  "Không có mô tả"
                }
                disabled
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-600 bg-gray-50 resize-none cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 italic">
                Mô tả từ yêu cầu của khách hàng (chỉ xem)
              </p>
            </div>

            {/* Status Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                value={modalState.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white shadow-sm hover:border-gray-300"
              >
                {statusRows.map((status) => {
                  const statusId = getString(status, "id");
                  const statusName = getString(status, "name");
                  return (
                    <option key={statusId} value={statusId}>
                      {statusName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                Giá báo giá <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg">
                  ₫
                </span>
                <input
                  type="text"
                  value={modalState.price}
                  onChange={(e) => onPriceChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 text-base font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white shadow-sm hover:border-gray-300"
                  placeholder="Nhập giá báo giá (VD: 1,500,000)"
                />
              </div>
            </div>

            {canAddAttachment && (
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  File đính kèm <span className="text-red-500">*</span>
                </label>

                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <FileText className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                      Nhấp để chọn hoặc kéo thả file
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tối đa 10MB mỗi file • Không chấp nhận video
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={onFileSelect}
                    className="hidden"
                  />
                </label>

                {modalState.fileError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-500 mt-0.5">⚠️</span>
                    <p className="text-sm text-red-600">{modalState.fileError}</p>
                  </div>
                )}

                {modalState.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      File đã chọn ({modalState.files.length})
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {modalState.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 group hover:shadow-md transition-all"
                        >
                          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveFile(idx)}
                            className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                            title="Xóa file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
            <p className="text-xs text-gray-400">
              {modalState.price.trim() &&
              modalState.status &&
              (!canAddAttachment || modalState.files.length > 0) ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span>✓</span> Sẵn sàng gửi
                </span>
              ) : (
                <span>Vui lòng điền đầy đủ thông tin</span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 font-medium rounded-xl border border-gray-300 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={onSendEmail}
                disabled={
                  modalState.isSending ||
                  !modalState.price.trim() ||
                  !modalState.status ||
                  (canAddAttachment && modalState.files.length === 0)
                }
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                {modalState.isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Gửi email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmState && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <ConfirmDialog
            open={confirmState}
            title="Xác nhận gửi email"
            description="Bạn có chắc chắn muốn gửi email báo giá cho khách hàng?"
            confirmLabel="Gửi"
            cancelLabel="Hủy"
            onConfirm={onConfirm}
            onCancel={onCancelConfirm}
          />
        </div>
      )}
    </>
  );
};
