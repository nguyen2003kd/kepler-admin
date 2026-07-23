"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash,
  FolderTree,
  Plus,
  ExternalLink,
  FileText,
} from "lucide-react";
import { DynamicIcon } from "@/components/shared/lucide-icon-picker";
import Link from "next/link";
import type { AnyAbility } from "@casl/ability";
import type { Category, CategoryColumnsProps } from "@/types/category";

export const createCategoryColumns = ({
  rows,
  expanded,
  onToggle,
  onEdit,
  onAddChild,
  onDelete,
  ability,
}: CategoryColumnsProps & { ability: AnyAbility }): ColumnDef<
  Category & { depth: number; parentId: string | null }
>[] => {
  return [
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => {
      const category = row.original;
      const hasChildren = rows.some((r) => r.parentId === category.id);
      return (
        <div
          className="flex items-center"
          style={{ marginLeft: category.depth * 24 }}
        >
          {hasChildren && (
            <button
              className="mr-2 p-1 hover:bg-gray-100 rounded"
              onClick={() => onToggle(category.id)}
            >
              {expanded[category.id] ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          )}
          {category.icon_url ? (
            <DynamicIcon
              name={category.icon_url}
              className={`w-4 h-4 mr-2 ${
                category.depth > 0 ? "text-blue-500" : "text-orange-500"
              }`}
            />
          ) : (
            <FolderTree
              className={`w-4 h-4 mr-2 ${
                category.depth > 0 ? "text-blue-500" : "text-orange-500"
              }`}
            />
          )}
          <div className="font-medium">{category.name}</div>
          {category.link && (
            <a
              href={category.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
              title="Mở liên kết"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return code ? (
        <Badge variant="outline" className="font-mono text-xs">
          {code}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Vị trí",
    cell: ({ row }) => {
      const position = row.getValue("position") as number;
      return position ? (
        <Badge variant="secondary" className="text-xs">
          {position}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Liên kết",
    cell: ({ row }) => {
      const link = row.getValue("link") as string;
      return link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
        >
          <span className="max-w-[150px] truncate">{link}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return desc ? (
        <span className="text-sm text-gray-600">
          {desc.length > 40 ? desc.substring(0, 40) + "..." : desc}
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ability.can('update', 'category') && (
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {ability.can('add_children', 'category') && (
              <DropdownMenuItem onClick={() => onAddChild(category)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục con
              </DropdownMenuItem>
            )}
            {ability.can('view_post', 'category') && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/category/${category.id}/posts`}
                  className="flex items-center"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Xem bài viết
                </Link>
              </DropdownMenuItem>
            )}
            {ability.can('delete', 'category') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
};
