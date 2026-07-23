"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PageHeaderProps } from "../types";

export function PageHeader({ categoryName }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/category" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Bài viết của danh mục: {categoryName || "Đang tải..."}
        </h2>
        <p className="text-muted-foreground">
          Quản lý các bài viết thuộc danh mục này
        </p>
      </div>
    </div>
  );
}
