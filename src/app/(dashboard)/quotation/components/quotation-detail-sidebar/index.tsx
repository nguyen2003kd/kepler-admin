"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, FileText, Download } from "lucide-react";
import { useGetApiV10QuotationStatus } from "@/api/endpoints/quotation-status";
import { useGetApiV10Calibration } from "@/api/endpoints/calibration";
import { useGetApiV10ReceiveMethod } from "@/api/endpoints/receive-method";
import { toast } from "@components/ui/toaster";
import baseConfig from "@/configs/base";
type QuotationDetailSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  quotation: Record<string, unknown> | null;
};

export default function QuotationDetailSidebar({
  isOpen,
  onClose,
  quotation,
}: QuotationDetailSidebarProps) {
  const { data: statusResp } = useGetApiV10QuotationStatus();
  const { data: calibrationResp } = useGetApiV10Calibration();
  const { data: receiveMethodResp } = useGetApiV10ReceiveMethod();
  // const { data: serviceResp } = useGetApiV10Service();
  // Form state
  const [statusId, setStatusId] = useState("");
  const [calibrationId, setCalibrationId] = useState("");
  const [receiveMethodId, setReceiveMethodId] = useState("");
  // const [serviceId, setServiceId] = useState(""); // Changed to contact_person
  const [contactPerson, setContactPerson] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Update form when quotation changes
  useEffect(() => {
    if (quotation) {
      setStatusId(
        getString(quotation, "quotation_status_id") ||
        getString(getNestedObj(quotation, "quotation_status"), "id") ||
        "",
      );
      setCalibrationId(
        getString(quotation, "calibration_id") ||
        getString(getNestedObj(quotation, "calibration"), "id") ||
        "",
      );
      setReceiveMethodId(
        getString(quotation, "receive_method_id") ||
        getString(getNestedObj(quotation, "receive_method"), "id") ||
        "",
      );
      // setServiceId( // Changed to contact_person
      //   getString(quotation, "service_id") ||
      //   getString(getNestedObj(quotation, "service"), "id") ||
      //   "",
      // );
      setContactPerson(getString(quotation, "contact_person") || "");
      setPrice(getString(quotation, "price") || "");
      setDescription(getString(quotation, "description") || "");
    }
  }, [quotation]);

  const getRowsFromResp = (resp: unknown): unknown[] => {
    if (!resp || typeof resp !== "object") return [];
    const r = resp as { responseData?: { rows?: unknown[] } };
    return Array.isArray(r.responseData?.rows) ? r.responseData!.rows! : [];
  };

  const getString = (
    obj: Record<string, unknown> | undefined,
    ...keys: string[]
  ) => {
    if (!obj) return "";
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
    }
    return "";
  };

  const getNestedObj = (
    obj: Record<string, unknown> | undefined,
    key: string,
  ): Record<string, unknown> | undefined => {
    if (!obj) return undefined;
    const v = obj[key];
    if (v && typeof v === "object") return v as Record<string, unknown>;
    return undefined;
  };

  const statusRows = getRowsFromResp(statusResp).map(
    (m) => m as Record<string, unknown>,
  );
  const calibrationRows = getRowsFromResp(calibrationResp).map(
    (m) => m as Record<string, unknown>,
  );
  const receiveMethodRows = getRowsFromResp(receiveMethodResp).map(
    (m) => m as Record<string, unknown>,
  );
  // const serviceRows = getRowsFromResp(serviceResp).map(
  //   (m) => m as Record<string, unknown>,
  // );

  const files = Array.isArray(quotation?.["files"])
    ? (quotation["files"] as unknown[])
    : [];
  const currentStatusName = getString(
    getNestedObj(quotation ?? {}, "quotation_status"),
    "name",
  ).toLowerCase();
  const isDisabled =
    currentStatusName === "hoàn tất" ||
    currentStatusName === "hoàn thành" ||
    currentStatusName === "từ chối" ||
    currentStatusName === "rejected" ||
    currentStatusName === "completed";

  if (!isOpen) return null;

  // Use portal to render outside table DOM tree
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Chi tiết báo giá
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-0.5">
              #
              {getString(quotation ?? {}, "code", "id")
                .slice(0, 8)
                .toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDisabled
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
                }`}
            >
              {getString(
                getNestedObj(quotation ?? {}, "quotation_status"),
                "name",
              ) || "Mới tạo"}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {getString(quotation ?? {}, "name")
                  .charAt(0)
                  .toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {getString(quotation ?? {}, "name") || "--"}
                </p>
                <p className="text-sm text-gray-500">
                  {getString(quotation ?? {}, "organization_name") || "Cá nhân"}
                </p>
              </div>
            </div>
            <div className="pl-13 space-y-1.5 ml-13">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">📧</span>
                {getString(quotation ?? {}, "email") || "--"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">📱</span>
                {getString(quotation ?? {}, "phone_number") || "--"}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Mô tả yêu cầu
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={true}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              placeholder="Nhập mô tả..."
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Báo giá
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                $
              </span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={true}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Contact Person - Changed from service_id dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Người liên hệ
            </label>
            <input
              type="text"
              value={contactPerson}
              disabled={true}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Không có"
            />
          </div>

          {/* Old Service dropdown - commented out, changed to contact_person */}
          {/* <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Dịch vụ
            </label>
            <select
              value={serviceId}
              disabled={true}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">Chọn...</option>
              {serviceRows.map((s, idx) => (
                <option
                  key={getString(s, "id") || idx}
                  value={getString(s, "id")}
                >
                  {getString(s, "name")}
                </option>
              ))}
            </select>
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Trạng thái
              </label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                disabled={true}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Chọn...</option>
                {statusRows.map((s, idx) => (
                  <option
                    key={getString(s, "id") || idx}
                    value={getString(s, "id")}
                  >
                    {getString(s, "name")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tiêu chuẩn
              </label>
              <select
                disabled={true}
                value={calibrationId}
                onChange={(e) => setCalibrationId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Chọn...</option>
                {calibrationRows.map((c, idx) => (
                  <option
                    key={getString(c, "id") || idx}
                    value={getString(c, "id")}
                  >
                    {getString(c, "name")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Created Date & Receive Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </label>
              <p className="text-sm font-medium text-gray-900 py-2">
                {quotation?.["created_at"]
                  ? new Date(
                    String(quotation["created_at"]),
                  ).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  : "--"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Vận chuyển
              </label>
              <select
                value={receiveMethodId}
                onChange={(e) => setReceiveMethodId(e.target.value)}
                disabled={true}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Chọn...</option>
                {receiveMethodRows.map((rm, idx) => (
                  <option
                    key={getString(rm, "id") || idx}
                    value={getString(rm, "id")}
                  >
                    {getString(rm, "name")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Customer Files */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              File đính kèm từ khách hàng
            </label>
            <p className="text-xs text-gray-500">
              Chỉ xem, không thể chỉnh sửa
            </p>
            <div className="space-y-2">
              {files.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Không có file đính kèm
                </p>
              ) : (
                files.map((f) => {
                  const ff = f as Record<string, unknown>;
                  const fid = getString(ff, "id");
                  const fpath = getString(ff, "path");
                  const fname = getString(ff, "name");
                  const fsize = getString(ff, "size");

                  const handleDownload = async () => {
                    try {
                      const fileUrl = baseConfig.imgEndpointDomain + fpath;
                      const response = await fetch(fileUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = fname || "download";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error("Download error:", error);
                      toast.error({
                        title: "Lỗi",
                        content: "Không thể tải file",
                      });
                    }
                  };

                  return (
                    <button
                      key={fid || fpath || fname}
                      onClick={handleDownload}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                          {fname}
                        </p>
                        <p className="text-xs text-gray-400">
                          {fsize || "Không rõ kích thước"}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                    </button>
                  );
                })
              )}
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>,
    document.body,
  );
}
