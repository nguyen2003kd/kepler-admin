"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { Header } from "@/components/layout/header";
import { ConfirmDialog } from "@components/ui/confirm-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Newspaper } from "lucide-react";
import Can from "@/acl/Can";
import { useNewsColumns } from "./components/news-columns";
import { NewsStats } from "./components/news-stats";
import { useNewsData, useNewsDelete } from "./hooks";

export default function NewsPage() {
  const [searchQ, setSearchQ] = React.useState("");
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    targetId?: string;
  }>({ open: false });

  // Data hooks
  const {
    news,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNewsData(searchQ);

  // Filter type state: 'all', 'news' (is_service=false), 'service' (is_service=true)
  const [filterType, setFilterType] = useState<"all" | "news" | "service">(
    "all"
  );

  // Filter news by is_service
  const filteredNews = useMemo(() => {
    if (filterType === "all") return news;
    if (filterType === "news") return news.filter((n) => !n.is_service);
    if (filterType === "service") return news.filter((n) => n.is_service);
    return news;
  }, [news, filterType]);

  const { handleDelete: performDelete } = useNewsDelete(refetch);

  // Handlers
  const handleDelete = (id: string) => {
    setConfirmState({ open: true, targetId: id });
  };

  const handleDeleteConfirmed = async () => {
    const id = confirmState.targetId;
    if (!id) {
      setConfirmState({ open: false });
      return;
    }
    await performDelete(id);
    setConfirmState({ open: false });
  };

  const handleCancelDelete = () => setConfirmState({ open: false });

  // Columns with action handlers
  const newsColumns = useNewsColumns({ onDelete: handleDelete });

  return (
    <div>
      <Header title="Tin tức" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tin tức</h2>
              <p className="text-muted-foreground">Quản lý tin tức</p>
            </div>
            <div className="flex space-x-2">


              <Can I="create_post_info" a="news">
                <Button className="bg-[#19426D] text-white border-[#19426D] hover:bg-[#0f3b5a]">
                  <Link href="/news/create">Thêm tin tức</Link>
                </Button>
              </Can>
            </div>
          </div>

          {/* Stats Cards */}
          <NewsStats news={news} />

          {/* News Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tin tức</CardTitle>
              <CardDescription>Quản lý các bài viết tin tức</CardDescription>
              {/* Tabs filter for is_service */}
              <div className="mt-4">
                <Tabs
                  value={filterType}
                  onValueChange={(value) =>
                    setFilterType(value as "all" | "news" | "service")
                  }
                  className="w-full"
                >
                  <TabsList className="inline-flex h-auto gap-1 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-sm font-medium transition-all"
                    >
                      Tất cả ({news.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="news"
                      className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      <Newspaper className="h-4 w-4" />
                      Tin tức ({news.filter((n) => !n.is_service).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="service"
                      className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      <Briefcase className="h-4 w-4" />
                      Dịch vụ ({news.filter((n) => n.is_service).length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={newsColumns}
                data={filteredNews}
                searchPlaceholder="Search tin tức..."
                isLoading={isLoading}
                onRefresh={refetch}
                onLoadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onSearch={setSearchQ}
              />
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={confirmState.open}
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
          confirmLabel="Xóa"
          cancelLabel="Hủy"
          onConfirm={handleDeleteConfirmed}
          onCancel={handleCancelDelete}
        />
      </main>
    </div>
  );
}
