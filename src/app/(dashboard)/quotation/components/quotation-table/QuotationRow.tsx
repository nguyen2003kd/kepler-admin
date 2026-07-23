"use client";

import React from "react";
// import { useGetApiV10PostId } from "@/api/endpoints/post";
import { Eye, Mail, MessageSquare, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAbility } from "@/hooks/use-ability";
import type { QuotationRow as QuotationRowType } from "./types";
import { getString, getNestedObj } from "./utils";

interface QuotationRowProps {
  row: QuotationRowType;
  statusRows: QuotationRowType[];
  calibrationRows: QuotationRowType[];
  serviceRows?: QuotationRowType[];
  isStatusLoading: boolean;
  loadingStatus: string | null;
  onStatusChange: (id: string, statusId: string) => void;
  onViewDetail: (row: QuotationRowType) => void;
  onOpenEmailModal: (row: QuotationRowType) => void;
  onOpenResponseModal: (row: QuotationRowType) => void;
  onDelete: (id: string) => void;
}

export const QuotationRow: React.FC<QuotationRowProps> = ({
  row,
  statusRows,
  isStatusLoading,
  loadingStatus,
  onStatusChange,
  onViewDetail,
  onOpenEmailModal,
  onOpenResponseModal,
  onDelete,
}) => {
  const ability = useAbility();

  const canUpdateStatus = ability.can("update_status", "quotation");
  const canReplyEmail = ability.can("reply_email", "quotation");
  const canReplyCustomer = ability.can("reply_customer", "quotation");
  const canDelete = ability.can("delete", "quotation");

  // const postId = getString(row, "post_id");
  // const { data: postResp } = useGetApiV10PostId(postId, {
  //   query: { enabled: !!postId, staleTime: 1000 * 60 * 5 },
  // });
  const id = getString(row, "id");
  const currentStatusId =
    getString(getNestedObj(row, "quotation_status"), "id") ||
    getString(row, "quotation_status_id") ||
    "";
  const isUpdatingStatus = loadingStatus === id;

  const currentStatusName = getString(
    getNestedObj(row, "quotation_status"),
    "name",
  ).toLowerCase();
  const isDisabled =
    currentStatusName === "hoàn tất" ||
    currentStatusName === "hoàn thành" ||
    currentStatusName === "từ chối" ||
    currentStatusName === "rejected" ||
    currentStatusName === "completed";
  return (
    <tr className="border-t border-gray-100 transition-all duration-200 hover:bg-blue-50/50 group">
      <td className="px-5 py-5 align-top">
        <div className="font-semibold text-gray-900">
          {getString(row, "name")}
        </div>
      </td>
      <td className="px-5 py-5 align-top">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-xs opacity-70">📧</span>
            {getString(row, "email")}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-xs opacity-70">📱</span>
            {getString(row, "phone_number")}
          </div>
        </div>
      </td>
      <td className="px-5 py-5 align-top">
        <div className="text-sm font-medium text-gray-700">
          {getString(row, "organization_name") || (
            <span className="text-gray-400 italic">--</span>
          )}
        </div>
      </td>
      <td className="px-5 py-5 align-top">
        <div className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block max-w-[200px] truncate">
          {getString(row, "contact_person") || (
            <span className="text-gray-400 italic">--</span>
          )}
        </div>
      </td>
      <td className="px-5 py-5 align-top">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <select
              className="w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm border-gray-200 bg-white text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              value={currentStatusId}
              disabled={
                isStatusLoading ||
                isUpdatingStatus ||
                isDisabled ||
                !canUpdateStatus
              }
              onChange={(e) => onStatusChange(id, e.target.value)}
            >
              {statusRows.length === 0 && (
                <option value="">
                  {isStatusLoading
                    ? "Đang tải..."
                    : getString(getNestedObj(row, "quotation_status"), "name") ||
                      "Mới tạo"}
                </option>
              )}
              {statusRows.map((status, idx) => {
                const val = getString(status, "id", "quotation_status_id", "name");
                const label = getString(status, "name", "title", "label") || val;
                return (
                  <option key={val || String(idx)} value={val}>
                    {label}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              {isUpdatingStatus ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </td>
      {/* <td className="px-5 py-5 align-top">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
          {getCalibrationName(getString(row, "calibration_id")) ||
            getString(getNestedObj(row, "calibration"), "name") || (
              <span className="text-gray-400 italic">--</span>
            )}
        </span>
      </td> */}
      <td className="px-5 py-5 align-top text-center">
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1 bg-white shadow-xl border border-gray-100 rounded-xl"
            >
              <DropdownMenuItem
                className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => onViewDetail(row)}
              >
                <Eye className="mr-3 h-4 w-4" />
                <span className="font-medium">Xem chi tiết</span>
              </DropdownMenuItem>
              {!isDisabled && (
                <>
                  {canReplyEmail && (
                    <DropdownMenuItem
                      className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                      onClick={() => onOpenEmailModal(row)}
                    >
                      <Mail className="mr-3 h-4 w-4" />
                      <span className="font-medium">Gửi email báo giá</span>
                    </DropdownMenuItem>
                  )}
                  {canReplyCustomer && (
                    <DropdownMenuItem
                      className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                      onClick={() => onOpenResponseModal(row)}
                    >
                      <MessageSquare className="mr-3 h-4 w-4" />
                      <span className="font-medium">Phản hồi khách hàng</span>
                    </DropdownMenuItem>
                  )}
                </>
              )}
              {canDelete && (
                <>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                    onClick={() => onDelete(id)}
                  >
                    <Trash2 className="mr-3 h-4 w-4" />
                    <span className="font-medium">Xóa</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};
