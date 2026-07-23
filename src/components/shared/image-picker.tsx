"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import { X, Search, Image as ImageIcon, Video, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import baseConfig from "@configs/base";
import {
  getGetApiV10FileQueryKey,
  getApiV10File,
} from "@/api/endpoints/file";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUpload } from "@/app/(dashboard)/list-img/components/image-upload";
import { VideoUpload } from "@/app/(dashboard)/list-video/components/video-upload";
import { FileUpload } from "@/app/(dashboard)/list-file/components/file-upload";
import Can from "@/acl/Can";
import { extractVideoThumbnail } from "@/utils/video-thumbnail";

export type ImagePickerType = "image" | "video" | "file";

export interface ImagePickerFile {
  id: string;
  path: string;
  name: string;
  mime: string;
  size: string;
  compress_info?: {
    mobile: string;
    tablet: string;
    desktop: string;
    preload: string;
  };
  title?: string;
  description?: string;
}

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: ImagePickerFile) => void;
  selectedFileId?: string;
  /** Loại file cần chọn: image = kho ảnh, video = kho video, file = kho tài liệu */
  type?: ImagePickerType;
}

const PAGE_SIZE = 20;

const TYPE_LABELS: Record<ImagePickerType, string> = {
  image: "Kho ảnh",
  video: "Kho video",
  file: "Kho tài liệu",
};

const TYPE_MIME_PREFIX: Record<ImagePickerType, string[]> = {
  image: ["image/"],
  video: ["video/"],
  file: [], // file = everything except image/video
};

function isCorrectMime(
  mime: string,
  type: ImagePickerType
): boolean {
  const prefixes = TYPE_MIME_PREFIX[type];
  if (prefixes.length === 0) {
    // "file" = not image, not video
    return (
      !mime.startsWith("image/") && !mime.startsWith("video/")
    );
  }
  return prefixes.some((p) => mime.startsWith(p));
}

function getFileSrc(file: ImagePickerFile, type: ImagePickerType): string {
  const base = baseConfig.imgEndpointDomain;
  if (type === "image") {
    const p =
      file.compress_info?.desktop ||
      file.compress_info?.tablet ||
      file.path ||
      "";
    return `${base}${p}`;
  }
  return `${base}${file.path}`;
}


function formatSize(bytes: string): string {
  const n = parseInt(bytes, 10);
  if (isNaN(n)) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedFileId,
  type = "image",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ImagePickerFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  // Per-file thumbnail cache (keyed by file path)
  const [thumbCache, setThumbCache] = useState<Record<string, string>>({});
  // Files currently generating thumbnails
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Build filter string
  const filters = React.useMemo(() => {
    const parts: string[] = [];
    // Filter by type via mime
    if (type === "image") parts.push(`type==IMAGE`);
    else if (type === "video") parts.push(`type==VIDEO`);
    else if (type === "file")
      parts.push(`type==DEFAULT`);
    parts.push("is_in_library==true");
    if (searchTerm.trim()) {
      parts.push(`(title|description|note)@=${searchTerm.trim()}`);
    }
    return parts.join(",");
  }, [type, searchTerm]);

  const fetchPage = useCallback(
    async (pageNum: number, reset = false) => {
      if (pageNum === 1) setIsLoading(true);
      else setIsFetching(true);
      try {
        const res = await getApiV10File({
          page: pageNum,
          pageSize: PAGE_SIZE,
          filters,
          sortField: "created_at",
          sortOrder: "desc",
        });
        const rows = (res.responseData?.rows ?? []) as Record<string, unknown>[];
        const mapped: ImagePickerFile[] = rows.map((obj) => ({
          id: String(obj.id ?? ""),
          path: String(obj.path ?? ""),
          name: String(obj.name ?? ""),
          mime: String(obj.mime ?? ""),
          size: String(obj.size ?? ""),
          compress_info:
            (obj.compress_info as ImagePickerFile["compress_info"]) ??
            undefined,
          title:
            typeof obj.title === "string" ? obj.title : undefined,
          description:
            typeof obj.description === "string"
              ? obj.description
              : undefined,
        }));

        const filtered = mapped.filter((f) =>
          isCorrectMime(f.mime, type)
        );

        if (reset || pageNum === 1) {
          setItems(filtered);
        } else {
          setItems((prev) => [...prev, ...filtered]);
        }

        // Auto-generate thumbnails for videos that don't have one
        if (type === "video" && reset) {
          filtered.forEach((f) => {
            if (!f.compress_info?.preload && !thumbCache[f.path]) {
              generateThumbnail(f);
            }
          });
        }

        const cnt = res.responseData?.count ?? 0;
        setTotal(cnt);
        setHasMore(pageNum * PAGE_SIZE < cnt);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [filters, type]
  );

  // Initial load & search
  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setItems([]);
    setHasMore(true);
    setTotal(0);
    fetchPage(1, true);
  }, [isOpen, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  }, [isFetching, hasMore, page, fetchPage]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!containerRef.current || !loadMoreRef.current) return;
    const root = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !isFetching) {
            loadMore();
          }
        });
      },
      { root, rootMargin: "300px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isFetching]);

  // ── Video thumbnail generation ────────────────────────────────────────────
  const generateThumbnail = useCallback(
    async (file: ImagePickerFile) => {
      const fullUrl = `${baseConfig.imgEndpointDomain}${file.path}`;
      setGeneratingIds((prev) => new Set(prev).add(file.id));
      try {
        const thumb = await extractVideoThumbnail(fullUrl, 0.8, 0.8);
        if (thumb) {
          setThumbCache((prev) => ({ ...prev, [file.path]: thumb }));
        }
      } catch {
        // ignore — thumbnail will remain empty
      } finally {
        setGeneratingIds((prev) => {
          const next = new Set(prev);
          next.delete(file.id);
          return next;
        });
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: getGetApiV10FileQueryKey(),
    });
    setPage(1);
    fetchPage(1, true);
  };

  const visibleItems = React.useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (f) =>
        f.name?.toLowerCase().includes(term) ||
        (f.title ?? "").toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const TypeIcon = type === "image" ? ImageIcon : type === "video" ? Video : FileText;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 bg-black/50 z-[999999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[999999] -translate-x-1/2 -translate-y-1/2",
            "bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-bold">{TYPE_LABELS[type]}</h3>
            </div>
            <div className="flex items-center gap-2">
              {type === "image" && (
                <Can I="upload" a="gallery">
                  <ImageUpload onSuccess={handleRefresh} />
                </Can>
              )}
              {type === "video" && (
                <Can I="upload" a="gallery_video">
                  <VideoUpload onSuccess={handleRefresh} />
                </Can>
              )}
              {type === "file" && (
                <Can I="upload" a="gallery_document">
                  <FileUpload onSuccess={handleRefresh} />
                </Can>
              )}
              <DialogPrimitive.Close asChild>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <X className="h-5 w-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={containerRef} className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <TypeIcon className="h-8 w-8 mb-2 opacity-50" />
                <p>Không có tệp nào</p>
              </div>
            ) : (
              <div>
                {type === "image" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleItems.map((file) => (
                      <div
                        key={file.id}
                        className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                          selectedFileId === file.id
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => onSelect(file)}
                      >
                        <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                          <Image
                            src={getFileSrc(file, type)}
                            alt={file.title || file.name || "Hình ảnh"}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white rounded-lg px-3 py-1 text-sm font-medium">
                              Chọn
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <p className="text-white text-xs truncate">
                            {file.title || file.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleItems.map((file) => {
                      const serverThumb = file.compress_info?.preload || file.compress_info?.desktop || file.compress_info?.tablet;
                      const localThumb = thumbCache[file.path];
                      const isGenerating = generatingIds.has(file.id);

                      return (
                        <div
                          key={file.id}
                          className={`relative group cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                            selectedFileId === file.id
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => onSelect(file)}
                        >
                          <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                            {type === "video" && isGenerating ? (
                              <div className="flex flex-col items-center justify-center gap-1 text-blue-400">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="text-[10px]">Tạo thumbnail...</span>
                              </div>
                            ) : type === "video" && (localThumb || serverThumb) ? (
                              <Image
                                src={localThumb || `${baseConfig.imgEndpointDomain}${serverThumb}`}
                                alt={file.title || file.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                            ) : type === "video" ? (
                              <div className="flex flex-col items-center justify-center">
                                <Video className="h-12 w-12 text-blue-400" />
                              </div>
                            ) : serverThumb ? (
                              <Image
                                src={`${baseConfig.imgEndpointDomain}${serverThumb}`}
                                alt={file.title || file.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="h-12 w-12 text-orange-400" />
                              </div>
                            )}

                            {type === "video" && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                  <Video className="h-5 w-5 text-blue-600 fill-blue-600" />
                                </div>
                              </div>
                            )}

                            <div className="absolute top-2 right-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                type === "video"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}>
                                {type === "video" ? "Video" : "File"}
                              </span>
                            </div>
                          </div>

                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white rounded-lg px-3 py-1 text-sm font-medium">
                                Chọn
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs truncate">
                              {file.title || file.name}
                            </p>
                            <p className="text-white/60 text-[10px] truncate">
                              {file.mime} &bull; {formatSize(file.size)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div ref={loadMoreRef} />
                <div className="flex items-center justify-center mt-4">
                  {isFetching ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  ) : hasMore ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={loadMore}
                    >
                      Tải thêm ({total})
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Đã hiển thị {visibleItems.length} / {total} tệp
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <DialogPrimitive.Close asChild>
              <Button variant="outline">
                Hủy
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
