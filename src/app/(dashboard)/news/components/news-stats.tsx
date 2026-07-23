"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, AlertTriangle, TrendingUp } from "lucide-react";
import type { News } from "@/types/news";

interface NewsStatsProps {
  news: News[];
}

export function NewsStats({ news }: NewsStatsProps) {
  const stats = {
    total: news.length,
    published: news.filter((n) => !n.is_hidden && !n.expired_at).length,
    hidden: news.filter((n) => n.is_hidden).length,
    expired: news.filter(
      (n) => n.expired_at && new Date(n.expired_at) < new Date()
    ).length,
  };

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng tin tức</CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Tổng số bài viết</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đang hiển thị</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.published}</div>
          <p className="text-xs text-green-600">Bài viết công khai</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã ẩn</CardTitle>
          <AlertTriangle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hidden}</div>
          <p className="text-xs text-green-600">Bài viết bị ẩn</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đã hết hạn</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expired}</div>
          <p className="text-xs text-red-600">Bài viết hết hạn</p>
        </CardContent>
      </Card>
    </div>
  );
}
