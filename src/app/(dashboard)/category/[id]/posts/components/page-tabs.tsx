"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PageTabsProps } from "../types";

export function PageTabs({
  pages,
  selectedPageId,
  onPageChange,
  isPagesLoading,
  children,
}: PageTabsProps) {
  return (
    <Tabs
      value={selectedPageId || "category"}
      onValueChange={(value) =>
        onPageChange(value === "category" ? undefined : value)
      }
      className="w-full"
    >
      <div className="mb-6 overflow-x-auto pb-2">
        <TabsList className="inline-flex h-auto min-w-full flex-wrap gap-2 bg-transparent p-0">
          {/* <TabsTrigger
            value="category"
            className="relative data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=active]:scale-105 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:hover:border-blue-400 data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:shadow-md px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-out"
          >
            Danh sách
          </TabsTrigger> */}
          {isPagesLoading ? (
            <div className="px-6 py-3 text-sm text-gray-500 font-medium">
              Đang tải...
            </div>
          ) : (
            pages.map((page) => (
              <TabsTrigger
                key={page.id}
                value={page.id}
                className="relative data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=active]:scale-105 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-200 data-[state=inactive]:hover:border-blue-400 data-[state=inactive]:hover:text-blue-600 data-[state=inactive]:hover:shadow-md px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap"
              >
                {page.name}
              </TabsTrigger>
            ))
          )}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
