"use client";

import React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Calendar,
  CalendarX2,
  Clock,
  EyeOff,
  CheckCircle2,
  FileText,
  Briefcase,
  Copy,
} from "lucide-react";
import { useAbility } from "@/hooks/use-ability";
import type { News } from "@/types/news";
import baseConfig from "@/configs/base";
interface UseNewsColumnsProps {
  onDelete: (id: string) => void;
}
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function useNewsColumns({
  onDelete,
}: UseNewsColumnsProps): ColumnDef<News>[] {
  const ability = useAbility();
  const handleCopy = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(
        `${baseConfig.frontendDomain}/${slug}`,
      );
      toast.success("Đã sao chép liên kết");
    } catch (error) {
      toast.error("Không thể sao chép liên kết");
      console.error(error);
    }
  };
  return React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => (
          <div className="max-w-[280px] font-semibold text-gray-900 line-clamp-1">
            {row.getValue("title")}
          </div>
        ),
      },
      {
        accessorKey: "is_service",
        header: "Loại",
        cell: ({ row }) => {
          const isService = row.getValue("is_service") as boolean;
          return (
            <Badge
              className={`text-xs font-medium px-2.5 py-1 ${
                isService
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              {isService ? (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Dịch vụ
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Tin tức
                </span>
              )}
            </Badge>
          );
        },
      },
      {
        accessorKey: "published_at",
        header: "Xuất bản",
        cell: ({ row }) => {
          const value = row.getValue("published_at") as string | null;
          return value ? (
            <div className="flex items-center gap-1.5 text-sm text-green-600">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">{formatDate(value)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Chưa xuất bản</span>
            </div>
          );
        },
      },
      {
        accessorKey: "expired_at",
        header: "Hết hạn",
        cell: ({ row }) => {
          const value = row.getValue("expired_at") as string | null;
          if (!value) {
            return (
              <span className="text-sm text-gray-400 italic">Không có</span>
            );
          }

          const expiredDate = new Date(value);
          const isExpired = expiredDate < new Date();

          return (
            <div
              className={`flex items-center gap-1.5 text-sm ${
                isExpired ? "text-red-600" : "text-orange-600"
              }`}
            >
              <CalendarX2 className="w-3.5 h-3.5" />
              <span className="font-medium">{formatDate(value)}</span>
              {isExpired && (
                <Badge className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0">
                  Đã hết
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <div className="text-sm text-gray-600">
            <div className="font-medium">
              {formatDate(row.getValue("created_at"))}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "is_hidden",
        header: "Trạng thái",
        cell: ({ row }) => {
          const isHidden = row.getValue("is_hidden") as boolean;
          return (
            <Badge
              className={`text-xs font-semibold px-3 py-1.5 shadow-sm ${
                isHidden
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isHidden ? (
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5" />
                  Ẩn
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hiển thị
                </span>
              )}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Thao tác</div>,
        cell: ({ row }) => {
          const news = row.original;

          return (
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 p-1 bg-white shadow-xl border border-gray-100 rounded-xl"
                >
                  {ability.can("view_detail", "news") && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/news/${news.id}`}
                        className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="mr-3 h-4 w-4" />
                        <span className="font-medium">Xem chi tiết</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {ability.can("update", "news") && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/news/${encodeURIComponent(news.id)}/edit`}
                        className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-amber-50 text-gray-700 hover:text-amber-600 transition-colors"
                      >
                        <Edit className="mr-3 h-4 w-4" />
                        <span className="font-medium">Chỉnh sửa</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => handleCopy(news.slug)}
                    className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-amber-50 text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    <Copy className="mr-3 h-4 w-4" />
                    <span className="font-medium">Copy link bài viết</span>
                  </DropdownMenuItem>
                  {(ability.can("update", "news") ||
                    ability.can("delete", "news")) && (
                    <DropdownMenuSeparator className="my-1" />
                  )}
                  {ability.can("delete", "news") && (
                    <DropdownMenuItem
                      className="flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                      onClick={() => onDelete(news.id)}
                    >
                      <Trash className="mr-3 h-4 w-4" />
                      <span className="font-medium">Xóa</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onDelete, ability],
  );
}
