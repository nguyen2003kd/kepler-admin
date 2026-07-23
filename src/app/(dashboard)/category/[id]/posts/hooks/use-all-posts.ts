"use client";

import { getApiV10Post } from "@/api/endpoints/post";
import type { News, PostPage } from "@/types/news";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useAllPosts(searchQ: string) {
  const pageSize = 20;

  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PostPage,
    Error,
    InfiniteData<PostPage>,
    [string, number, string],
    number
  >({
    queryKey: ["all-posts-manager", pageSize, searchQ],
    queryFn: async ({ pageParam = 1, signal }) => {
      const trimmed = String(searchQ ?? "").trim();
      const statusFilter = "status==PUBLISHED";
      const filters = trimmed
        ? `(title|summary|code)@=${trimmed},${statusFilter}`
        : statusFilter;

      const res = await getApiV10Post(
        { page: pageParam, pageSize, sortOrder: "desc", filters, filterBy: "ADMIN" },
        signal
      );

      if (res.status !== "success") {
        throw new Error(res.message ?? "Get posts error");
      }

      const responseData =
        (
          res as {
            responseData?: {
              rows?: unknown[];
              count?: number;
              page?: number;
              pageSize?: number;
            };
          }
        )?.responseData ?? {};

      const rows = Array.isArray(responseData.rows) ? responseData.rows : [];

      const normalized: News[] = rows.map((r) => {
        const item = r as Partial<News> & Record<string, unknown>;
        return {
          id: String(item.id ?? ""),
          title: String(item.title ?? ""),
          code: String(item.code ?? ""),
          slug: String(item.slug ?? ""),
          thumbnail_path: item.thumbnail_path ?? null,
          summary: item.summary ?? null,
          position:
            typeof item.position === "number"
              ? (item.position as number)
              : Number(item.position ?? 0),
          is_hidden: Boolean(item.is_hidden),
          expired_at: item.expired_at ?? null,
          published_at: item.published_at ?? null,
          created_at: String(item.created_at ?? ""),
          updated_at: String(item.updated_at ?? ""),
          created_by: String(item.created_by ?? ""),
          updated_by: String(item.updated_by ?? ""),
          is_service: Boolean(item.is_service),
          thumbnail_compress_info:
            (item.thumbnail_compress_info as News["thumbnail_compress_info"]) ??
            null,
        };
      });

      return {
        page: responseData.page ?? pageParam,
        pageSize: responseData.pageSize ?? pageSize,
        count: typeof responseData.count === "number" ? responseData.count : 0,
        rows: normalized,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const p = lastPage.page ?? 1;
      const ps = lastPage.pageSize ?? pageSize;
      const total = lastPage.count ?? 0;
      const totalPages = ps > 0 ? Math.ceil(total / ps) : undefined;
      return totalPages && p < totalPages ? p + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const posts: News[] = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((p) => p.rows || []);
  }, [infiniteData]);

  return {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
