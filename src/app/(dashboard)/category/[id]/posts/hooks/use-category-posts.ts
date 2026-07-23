"use client";

import { getApiV10PostCategory } from "@/api/endpoints/post-category";
import type { News, PostCategoryItem } from "@/types/news";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { PostCategoryPage } from "../types";

export function useCategoryPostsWithQuery(
  categoryId: string,
  q: string,
  pageId?: string
) {
  const pageSize = 10;

  const {
    data: infiniteData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PostCategoryPage,
    Error,
    InfiniteData<PostCategoryPage>,
    [string, string, number, string, string],
    number
  >({
    queryKey: ["category-posts", categoryId, pageSize, q, pageId || "all"],
    queryFn: async ({ pageParam = 1, signal }) => {
      const trimmed = String(q ?? "").trim();
      let filters = `category_id==${categoryId}`;
      if (pageId) {
        filters += `,page_id==${pageId}`;
      } else {
        filters += `,page_id==null`;
      }
      if (trimmed) {
        filters += `;(post.title|post.summary|post.code)@=${encodeURI(trimmed)}`;
      }

      const res = await getApiV10PostCategory(
        {
          page: pageParam,
          pageSize,
          sortOrder: "desc",
          filters,
        },
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

      const normalized: PostCategoryItem[] = rows.map((r) => {
        const item = r as Record<string, unknown>;
        const postData = (item.post as Record<string, unknown>) || {};
        const pageData = (item.page as Record<string, unknown>) || {};

        const post: News = {
          id: String(postData.id ?? item.post_id ?? ""),
          title: String(postData.title ?? ""),
          code: String(postData.code ?? ""),
          slug: String(postData.slug ?? ""),
          thumbnail_path: (postData.thumbnail_path as string | null) ?? null,
          summary: (postData.summary as string | null) ?? null,
          position:
            typeof postData.position === "number"
              ? (postData.position as number)
              : Number(postData.position ?? 0),
          is_hidden: Boolean(postData.is_hidden),
          expired_at: (postData.expired_at as string | null) ?? null,
          published_at: (postData.published_at as string | null) ?? null,
          created_at: String(postData.created_at ?? ""),
          updated_at: String(postData.updated_at ?? ""),
          created_by: String(postData.created_by ?? ""),
          updated_by: String(postData.updated_by ?? ""),
          is_service: Boolean(postData.is_service),
          thumbnail_compress_info:
            (postData.thumbnail_compress_info as News["thumbnail_compress_info"]) ??
            null,
        };

        return {
          id: String(item.id ?? ""),
          post_id: String(item.post_id ?? ""),
          category_id: String(item.category_id ?? ""),
          page_id: String(item.page_id ?? ""),
          position:
            typeof item.position === "number"
              ? (item.position as number)
              : Number(item.position ?? 0),
          created_at: String(item.created_at ?? ""),
          post,
          page: pageData.id
            ? {
                id: String(pageData.id ?? ""),
                name: String(pageData.name ?? ""),
              }
            : undefined,
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
    enabled: !!categoryId,
  });

  const posts: PostCategoryItem[] = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((p) => p.rows || []);
  }, [infiniteData]);

  return {
    data: posts,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
