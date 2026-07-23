"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Loader2,
  Trash2,
  Calendar,
  CalendarX2,
} from "lucide-react";
import { PostImage } from "./post-image";
import type { SortablePostItemProps } from "../types";

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function SortablePostItem({
  post,
  onRemove,
  isRemoving,
  index,
  isSelected,
  onSelectChange,
  isMultiSelectMode,
}: SortablePostItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.postCategoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
        isSelected
          ? "bg-red-50 border-red-400 shadow-md ring-2 ring-red-200"
          : "bg-white hover:shadow-sm"
      }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectChange(checked === true)}
        disabled={isRemoving}
        className="h-5 w-5 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
      />
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 font-semibold text-md shadow-sm">
        {index + 1}
      </div>
      <PostImage
        src={
          post.thumbnail_compress_info?.mobile || post.thumbnail_path || null
        }
        alt={post.title}
        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium line-clamp-2 mb-1">{post.title}</div>
        <Badge variant="outline" className="text-xs">
          {post.code}
        </Badge>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          {post.published_at && (
            <span
              className="flex items-center gap-1 text-green-600"
              title="Ngày xuất bản"
            >
              <Calendar className="h-3 w-3" />
              <span className="font-medium">Xuất bản:</span>{" "}
              {formatDate(post.published_at)}
            </span>
          )}
          {post.expired_at && (
            <span
              className="flex items-center gap-1 text-red-600"
              title="Ngày hết hạn"
            >
              <CalendarX2 className="h-3 w-3" />
              <span className="font-medium">Hết hạn:</span>{" "}
              {formatDate(post.expired_at)}
            </span>
          )}
        </div>
      </div>
      {!isMultiSelectMode && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={isRemoving}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isRemoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
