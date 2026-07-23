"use client";

import React, { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck, Loader2, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useGetApiV10NotificationsInfinite,
  usePutApiV10NotificationsMarkAsRead,
  usePutApiV10NotificationsMarkAsReadId,
} from "@/api/endpoints/notification";
import type { Notification } from "@/api/models/notification";

type FilterTab = "all" | "read" | "unread";

const FILTER_LABELS: Record<FilterTab, string> = {
  all: "Tất cả",
  read: "Đã đọc",
  unread: "Chưa đọc",
};

function buildParams(tab: FilterTab) {
  if (tab === "read")
    return {
      filters: "has_user_read==true",
      pageSize: 20,
      sortOrder: "desc" as const,
      sortField: "created_at" as const,
    };
  if (tab === "unread")
    return {
      filters: "has_user_read==false",
      pageSize: 20,
      sortOrder: "desc" as const,
      sortField: "created_at" as const,
    };
  return {
    pageSize: 20,
    sortOrder: "desc" as const,
    sortField: "created_at" as const,
  };
}

function flattenPages(data: unknown): Notification[] {
  if (!data) return [];
  const d = data as { pages?: unknown[]; responseData?: unknown };
  if (Array.isArray(d?.pages)) {
    return d.pages.flatMap((page) => {
      const rd = (page as { responseData?: unknown })?.responseData;
      if (Array.isArray(rd)) return rd as Notification[];
      if (rd && typeof rd === "object" && "rows" in rd) {
        return ((rd as { rows?: Notification[] }).rows ?? []) as Notification[];
      }
      return [];
    });
  }
  if (Array.isArray(d?.responseData)) return d.responseData as Notification[];
  if (
    d?.responseData &&
    typeof d?.responseData === "object" &&
    "rows" in d.responseData
  ) {
    return ((d.responseData as { rows?: Notification[] }).rows ??
      []) as Notification[];
  }
  return [];
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return d.toLocaleDateString("vi-VN");
}

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FilterTab>("all");
  const queryClient = useQueryClient();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const markAllMutation = usePutApiV10NotificationsMarkAsRead();
  const markOneMutation = usePutApiV10NotificationsMarkAsReadId();

  // Infinite scroll query — only when popover is open
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useGetApiV10NotificationsInfinite(buildParams(tab), {
    query: {
      enabled: open,
      staleTime: 30_000,
    },
  });

  const notifications = flattenPages(data);

  // Keep all/unread queries for the badge count
  const { data: allData } = useGetApiV10NotificationsInfinite(
    { pageSize: 50, sortOrder: "desc" as const, sortField: "created_at" as const },
    {
      query: {
        staleTime: 30_000,
        refetchInterval: 60_000,
      },
    },
  );
  const { data: unreadData } = useGetApiV10NotificationsInfinite(
    {
      filters: "has_user_read==false",
      pageSize: 50,
      sortOrder: "desc" as const,
      sortField: "created_at" as const,
    },
    {
      query: {
        staleTime: 30_000,
        refetchInterval: 60_000,
      },
    },
  );

  const hasUnread =
    flattenPages(unreadData).length > 0 ||
    (allData && flattenPages(allData).some((n) => !n.has_user_read));

  // Intersection observer for infinite scroll
  const setupObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      loadMoreRef.current = node;
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const handleMarkAll = useCallback(async () => {
    try {
      await markAllMutation.mutateAsync({});
      await queryClient.invalidateQueries({
        queryKey: ["getApiV10NotificationsInfinite"],
      });
    } catch {
      // silently fail
    }
  }, [markAllMutation, queryClient]);

  const handleMarkOne = useCallback(
    async (id: string) => {
      try {
        await markOneMutation.mutateAsync({ id });
        await queryClient.invalidateQueries({
          queryKey: ["getApiV10NotificationsInfinite"],
        });
      } catch {
        // silently fail
      }
    },
    [markOneMutation, queryClient],
  );

  return (
    <div className="relative">
      {/* Bell button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
        )}
      </Button>

      {/* Popover panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 z-50 w-96 max-h-[520px] flex flex-col rounded-xl border bg-white dark:bg-zinc-900 shadow-xl dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-zinc-800 shrink-0">
              <h2 className="font-semibold text-sm">Thông báo</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                disabled={markAllMutation.isPending}
                onClick={handleMarkAll}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Đánh dấu đã đọc
              </Button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-3 py-2 border-b dark:border-zinc-800 shrink-0 bg-slate-50/50 dark:bg-zinc-950/50">
              {(Object.keys(FILTER_LABELS) as FilterTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    tab === t
                      ? "bg-blue-600 text-white"
                      : "text-muted-foreground hover:bg-slate-200 dark:hover:bg-zinc-800",
                  )}
                >
                  {FILTER_LABELS[t]}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading || isFetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                  <BellOff className="h-8 w-8 opacity-40" />
                  <p className="text-sm">Không có thông báo nào</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer border-b dark:border-zinc-800 last:border-0 transition-colors",
                        !n.has_user_read && "bg-blue-50/50 dark:bg-blue-950/20",
                      )}
                      onClick={() => {
                        if (n.id && !n.has_user_read) handleMarkOne(n.id);
                      }}
                    >
                      {/* Unread dot */}
                      <div className="mt-1.5 shrink-0">
                        {!n.has_user_read && (
                          <span className="block h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm leading-snug",
                              !n.has_user_read
                                ? "font-medium text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {n.content || n.title || "Thông báo"}
                          </p>
                          {!n.has_user_read && (
                            <button
                              className="shrink-0 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-zinc-700 text-muted-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (n.id) handleMarkOne(n.id);
                              }}
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(n.created_at ?? n.sent_time)}
                        </p>
                      </div>
                    </li>
                  ))}

                  {/* Intersection trigger */}
                  <div ref={setupObserver} className="h-px" />

                  {/* Load more spinner */}
                  {isFetchingNextPage && (
                    <li className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
