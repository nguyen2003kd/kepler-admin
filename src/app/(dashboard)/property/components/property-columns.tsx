"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Edit, ExternalLink, MapPin } from "lucide-react";
import { useAbility } from "@/hooks/use-ability";
import type { Property } from "@/api/models/property";
import { CLIENT_DOMAIN, GROUP_LABELS, UNIT_LABELS } from "../constants";

interface UsePropertyColumnsProps {
  onEdit: (property: Property) => void;
}

export function usePropertyColumns({
  onEdit,
}: UsePropertyColumnsProps): ColumnDef<Property>[] {
  const ability = useAbility();
  const canUpdate =
    ability.can("update", "property") || ability.can("update", "news");

  return React.useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Tên bất động sản",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="font-medium">
                {row.original.title || "Chưa đặt tên"}
              </div>
              {row.original.category && (
                <div className="text-xs text-muted-foreground">
                  {row.original.category}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "transaction_group",
        header: "Nhóm giao dịch",
        cell: ({ row }) => {
          const group = row.original.transaction_group;
          return group ? (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {GROUP_LABELS[group] || group}
            </span>
          ) : (
            <span className="text-muted-foreground">--</span>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Vị trí",
        cell: ({ row }) =>
          row.original.location ? (
            <div className="flex max-w-[220px] items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate" title={row.original.location}>
                {row.original.location}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">--</span>
          ),
      },
      {
        accessorKey: "price",
        header: "Giá",
        cell: ({ row }) => {
          const { price, price_unit } = row.original;
          if (price === null || price === undefined) {
            return <span className="text-muted-foreground">--</span>;
          }
          return (
            <span className="whitespace-nowrap">
              {new Intl.NumberFormat("vi-VN").format(price)}{" "}
              <span className="text-xs text-muted-foreground">
                {UNIT_LABELS[price_unit || ""] || ""}
              </span>
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) =>
          row.original.status === "PUBLISHED" ? (
            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Đang hiển thị
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              Bản nháp
            </span>
          ),
      },
      {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {row.original.created_at
                ? new Date(row.original.created_at).toLocaleDateString("vi-VN")
                : "--"}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.status === "PUBLISHED" && CLIENT_DOMAIN && (
              <Button variant="ghost" size="sm" asChild>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${CLIENT_DOMAIN.replace(/\/$/, "")}/san-giao-dich/san-pham/${row.original.id}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {canUpdate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onEdit, canUpdate]
  );
}
