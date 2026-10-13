'use client';

import { getApiV10Post } from '@/api/endpoints/post';
import { useQuery } from '@tanstack/react-query';

/**
 * Post IDs linked to a page (or to all pages of a category) via page_post.
 * The category_id query parameter works because pages.id = categories.id.
 */
export function useCategoryPostIds(categoryId: string, pageId?: string) {
  return useQuery({
    queryKey: ['category-post-ids', categoryId, pageId || 'all'],
    queryFn: async ({ signal }) => {
      const res = await getApiV10Post(
        {
          category_id: categoryId,
          page_id: pageId,
          page: 1,
          pageSize: 1000,
        },
        signal
      );

      if (res.status !== 'success') {
        throw new Error(res.message ?? 'Get category posts error');
      }

      const rows =
        (res as { responseData?: { rows?: Array<{ id?: string }> } })?.responseData
          ?.rows || [];

      return rows.map((r) => String(r.id ?? '')).filter(Boolean);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
  });
}

