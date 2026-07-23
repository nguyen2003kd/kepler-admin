"use client";

import { getApiV10PostCategory } from "@/api/endpoints/post-category";
import { useQuery } from "@tanstack/react-query";

export function useCategoryPostIds(categoryId: string, pageId?: string) {
  return useQuery({
    queryKey: ["category-post-ids", categoryId, pageId || "all"],
    queryFn: async ({ signal }) => {
      // Use large pageSize to get all post IDs in one request
      const largePageSize = 1000;
      let filters = `category_id==${categoryId}`;
      if (pageId) {
        filters += `,page_id==${pageId}`;
      } else {
        filters += `,page_id==null`;
      }

      const res = await getApiV10PostCategory(
        {
          page: 1,
          pageSize: largePageSize,
          filters,
        },
        signal
      );

      if (res.status !== "success") {
        throw new Error(res.message ?? "Get category posts error");
      }

      const responseData =
        (
          res as {
            responseData?: {
              rows?: Array<{ post_id?: string }>;
              count?: number;
            };
          }
        )?.responseData ?? {};

      const rows = Array.isArray(responseData.rows) ? responseData.rows : [];

      // Extract only post_id from the response
      return rows.map((r) => String(r.post_id ?? "")).filter(Boolean);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
  });
}
