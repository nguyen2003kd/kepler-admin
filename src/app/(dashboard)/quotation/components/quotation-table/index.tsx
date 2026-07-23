"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePutApiV10QuotationId,
  useDeleteApiV10QuotationId,
} from "@api/endpoints/quotation";
import { toast } from "@components/ui/toaster";
import { useGetApiV10QuotationStatus } from "@/api/endpoints/quotation-status";
import { useGetApiV10Calibration } from "@/api/endpoints/calibration";
import { useGetApiV10Service } from "@/api/endpoints/service";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import QuotationDetailSidebar from "../quotation-detail-sidebar";
import { QuotationRow } from "./QuotationRow";
import { EmailModal } from "./EmailModal";
import { ResponseModal } from "./ResponseModal";
import { useEmailModal } from "./hooks/useEmailModal";
import { useResponseModal } from "./hooks/useResponseModal";
import { extractErrorMessage } from "@/utils/error";
import { getString, getRowsFromResp } from "./utils";
import type { QuotationTableProps, QuotationRow as QuotationRowType } from "./types";

export default function QuotationTable({
  rows,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: QuotationTableProps) {
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedQuotationRef = useRef<QuotationRowType | null>(null);

  // Hooks for email and response modals
  const emailModal = useEmailModal();
  const responseModal = useResponseModal();

  // API hooks
  const deleteMut = useDeleteApiV10QuotationId();
  const putMut = usePutApiV10QuotationId();
  const qc = useQueryClient();

  // Confirmation states
  const [confirmDeleteState, setConfirmDeleteState] = useState<{
    open: boolean;
    targetId?: string;
  }>({ open: false });
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    open: boolean;
    quotationId?: string;
    statusId?: string;
  }>({ open: false });

  // Data
  const { data: statusResp, isLoading: isStatusLoading } =
    useGetApiV10QuotationStatus();
  const { data: calibrationResp } = useGetApiV10Calibration();
  const { data: serviceResp } = useGetApiV10Service();

  const statusRows = React.useMemo(() => {
    return getRowsFromResp(statusResp).map((m) => m as QuotationRowType);
  }, [statusResp]);

  const calibrationRows = React.useMemo(() => {
    return getRowsFromResp(calibrationResp).map((m) => m as QuotationRowType);
  }, [calibrationResp]);

  const serviceRows = React.useMemo(() => {
    return getRowsFromResp(serviceResp).map((m) => m as QuotationRowType);
  }, [serviceResp]);

  // Infinite scroll logic
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || isFetchingNextPage || !hasNextPage || !onLoadMore)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [isFetchingNextPage, hasNextPage, onLoadMore]);

  // Detail sidebar handlers
  const handleViewDetail = useCallback((quotation: QuotationRowType) => {
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    selectedQuotationRef.current = quotation;
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));

    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    window.scrollTo(0, scrollY);

    setIsSidebarOpen(false);
  }, []);

  // Delete handlers
  const handleDelete = async (id: string) => {
    setConfirmDeleteState({ open: true, targetId: id });
  };

  const handleDeleteConfirmed = async () => {
    const id = confirmDeleteState.targetId;
    if (!id) {
      setConfirmDeleteState({ open: false });
      return;
    }
    try {
      await deleteMut.mutateAsync({ id });
      toast.success({
        title: "Xóa thành công",
        content: "Báo giá đã được xóa.",
      });
      qc.invalidateQueries({ queryKey: ["quotations"] });
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error({ title: "Lỗi", content: msg });
    } finally {
      setConfirmDeleteState({ open: false });
    }
  };

  // Status change handlers
  const handleStatusChange = async (id: string, quotation_status_id: string) => {
    setConfirmStatusChange({
      open: true,
      quotationId: id,
      statusId: quotation_status_id,
    });
  };

  const handleConfirmStatusChange = async () => {
    const { quotationId, statusId } = confirmStatusChange;
    setConfirmStatusChange({ open: false });

    if (!quotationId || !statusId) return;

    const scrollY = window.scrollY;
    setLoadingStatus(quotationId);
    try {
      await putMut.mutateAsync({
        id: quotationId,
        data: { quotation_status_id: statusId },
      });
      toast.success({
        title: "Thành công",
        content: "Cập nhật trạng thái thành công.",
      });
      await qc.invalidateQueries({ queryKey: ["quotations"] });
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error({ content: msg });
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm table-fixed">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700">
              <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Khách hàng</div>
              </th>
              <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Liên hệ</div>
              </th>
              <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Công ty</div>
              </th>
              <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Dịch vụ</div>
              </th>
              <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Trạng thái</div>
              </th>
              {/* <th className="px-5 py-4 text-left text-white font-semibold tracking-wide">
                <div className="flex items-center gap-2">Loại mẫu</div>
              </th> */}
              <th className="px-5 py-4 text-center text-white font-semibold tracking-wide">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => {
              const rowId =
                getString(r as QuotationRowType, "id") || String(i);
              return (
                <QuotationRow
                  key={rowId}
                  row={r as QuotationRowType}
                  statusRows={statusRows}
                  calibrationRows={calibrationRows}
                  serviceRows={serviceRows}
                  isStatusLoading={isStatusLoading}
                  loadingStatus={loadingStatus}
                  onStatusChange={handleStatusChange}
                  onViewDetail={handleViewDetail}
                  onOpenEmailModal={emailModal.openModal}
                  onOpenResponseModal={responseModal.openModal}
                  onDelete={handleDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-lg font-medium">Chưa có báo giá nào</p>
          <p className="text-sm">Các báo giá mới sẽ xuất hiện ở đây</p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="h-14 flex items-center justify-center bg-gradient-to-t from-gray-50 to-white"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Đang tải thêm...
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              ↓ Cuộn xuống để tải thêm
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmDeleteState.open}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa báo giá này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeleteState({ open: false })}
      />

      <ConfirmDialog
        open={confirmStatusChange.open}
        title="Xác nhận thay đổi trạng thái"
        description="Bạn có chắc chắn muốn thay đổi trạng thái báo giá này?"
        confirmLabel="Xác nhận"
        cancelLabel="Hủy"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmStatusChange({ open: false })}
      />

      {/* Sidebar */}
      <QuotationDetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        quotation={selectedQuotationRef.current}
      />

      {/* Modals */}
      <EmailModal
        modalState={emailModal.modalState}
        statusRows={statusRows}
        onClose={emailModal.closeModal}
        onPriceChange={emailModal.updatePrice}
        onStatusChange={emailModal.updateStatus}
        onFileSelect={emailModal.handleFileSelect}
        onRemoveFile={emailModal.removeFile}
        onSendEmail={emailModal.handleSendEmail}
        confirmState={emailModal.confirmState}
        onConfirm={emailModal.confirmSendEmail}
        onCancelConfirm={emailModal.cancelConfirm}
        ConfirmDialog={ConfirmDialog}
      />

      <ResponseModal
        modalState={responseModal.modalState}
        statusRows={statusRows}
        onClose={responseModal.closeModal}
        onPriceChange={responseModal.updatePrice}
        onStatusChange={responseModal.updateStatus}
        onFileSelect={responseModal.handleFileSelect}
        onRemoveFile={responseModal.removeFile}
        onSubmit={responseModal.handleSubmit}
        confirmState={responseModal.confirmState}
        onConfirm={responseModal.confirmSubmit}
        onCancelConfirm={responseModal.cancelConfirm}
        ConfirmDialog={ConfirmDialog}
      />
    </div>
  );
}
