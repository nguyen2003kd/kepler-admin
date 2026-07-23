"use client";

import { useGetApiV10CategoryId } from "@/api/endpoints/category";
import { useGetApiV10Page } from "@/api/endpoints/page";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "./components/page-header";
import { PageTabs } from "./components/page-tabs";
import { PostManagerPanel } from "./components/post-selector-dialog";
import { StatsCards } from "./components/stats-cards";
import { useCategoryPostsWithQuery } from "./hooks/use-category-posts";
import type { CategoryPostStats, PageTabItem } from "./types";

export default function CategoryPostsPage() {
  const params = useParams();
  const categoryId = params.id as string;

  // Fetch pages for tabs
  const { data: pagesData, isLoading: isPagesLoading } = useGetApiV10Page({
    category_id: categoryId,
  });

  const pages: PageTabItem[] = useMemo(() => {
    const responseData = pagesData?.responseData as
      | { rows?: Array<{ id: string; name: string }> }
      | undefined;
    return responseData?.rows || [];
  }, [pagesData]);

  const [selectedPageId, setSelectedPageId] = useState<string | undefined>(
    undefined
  );

  // Auto-select first tab when pages are loaded
  useEffect(() => {
    if (pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].id);
    }
  }, [pages, selectedPageId]);

  const {
    data: posts = [],
    refetch,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
    isFetchingNextPage: isFetchingNextCategoryPage,
  } = useCategoryPostsWithQuery(categoryId, "", selectedPageId);

  // Get category info
  const { data: categoryData } = useGetApiV10CategoryId(categoryId);
  const category = categoryData?.responseData;

  const postsInCategory = useMemo(() => {
    return posts.map((p) => ({
      ...p.post,
      postCategoryId: p.id,
      position: p.position,
      page_id: p.page_id,
    }));
  }, [posts]);

  const stats: CategoryPostStats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((n) => !n.post.is_hidden && !n.post.expired_at)
        .length,
      hidden: posts.filter((n) => n.post.is_hidden).length,
      expired: posts.filter(
        (n) => n.post.expired_at && new Date(n.post.expired_at) < new Date()
      ).length,
    }),
    [posts]
  );

  return (
    <div>
      <Header title={`Bài viết - ${category?.name || "Danh mục"}`} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          <PageHeader categoryName={category?.name} />

          <StatsCards stats={stats} />

          <Card>
            <CardHeader>
              <CardTitle>Danh sách bài viết</CardTitle>
              <CardDescription>
                Các bài viết thuộc danh mục {category?.name || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageTabs
                pages={pages}
                selectedPageId={selectedPageId}
                onPageChange={setSelectedPageId}
                isPagesLoading={isPagesLoading}
              >
                <PostManagerPanel
                  categoryId={categoryId}
                  pageId={selectedPageId}
                  postsInCategory={postsInCategory}
                  onRefresh={refetch}
                  fetchNextCategoryPage={fetchNextCategoryPage}
                  hasNextCategoryPage={hasNextCategoryPage}
                  isFetchingNextCategoryPage={isFetchingNextCategoryPage}
                />
              </PageTabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
