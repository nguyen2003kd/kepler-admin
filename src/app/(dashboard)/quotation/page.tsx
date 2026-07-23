"use client"

import React, { useMemo, useState } from "react";
import { getApiV10QuotationAll } from "@api/endpoints/quotation";
import { SortOrderParameter } from "@api/models/sortOrderParameter";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import QuotationFilters from "./components/quotation-filters";
import QuotationTable from "./components/quotation-table";
import { FileText, Clock, CheckCircle, Inbox, UserCircle, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import Can from '@/acl/Can';

type TabType = "all" | "admin" | "customer";

export default function QuotationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const pageSize = 7;

  const combinedFilters = useMemo(() => {
    if (activeTab === "all") {
      // Remove is_admin and filters properties for "all" tab
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is_admin, filters: _filters, ...restFilters } = filters;
      return restFilters;
    }
    return {
      ...filters,
      filters: activeTab === "admin" ? "is_admin==true" : "is_admin==false",
    };
  }, [filters, activeTab]);

  const {
    data: infiniteData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    // refetch,
  } = useInfiniteQuery<
    {
      responseData?: {
        rows?: unknown[];
        count?: number;
        page?: number;
        pageSize?: number;
      };
    },
    Error,
    InfiniteData<{
      responseData?: {
        rows?: unknown[];
        count?: number;
        page?: number;
        pageSize?: number;
      };
    }>,
    [string, Record<string, unknown>, number],
    number
  >({
    queryKey: ["quotations", combinedFilters, pageSize],
    queryFn: async ({ pageParam = 1, signal }) => {
      const params = {
        page: pageParam,
        pageSize,
        sortField: "created_at",
        sortOrder: SortOrderParameter.desc,

        ...combinedFilters,
      };

      const res = await getApiV10QuotationAll(params, signal);

      if (res.status !== "success") {
        throw new Error(res.message ?? "Failed to fetch quotations");
      }

      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const responseData = lastPage?.responseData;
      if (!responseData) return undefined;

      const currentPage = responseData.page ?? 1;
      const totalCount = responseData.count ?? 0;
      const currentPageSize = responseData.pageSize ?? pageSize;
      const totalPages = Math.ceil(totalCount / currentPageSize);

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const rows = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap(
      (page) => page?.responseData?.rows ?? [],
    ) as Record<string, unknown>[];
  }, [infiniteData]);

  const total = rows.length;
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      new: 0,
      processing: 0,
      responded: 0,
      completed: 0,
    };
    rows.forEach((r) => {
      const receiveMethod = (r as Record<string, unknown>)["receive_method"] as
        | Record<string, unknown>
        | undefined;
      const statusRaw = receiveMethod?.["name"];
      const status =
        typeof statusRaw === "string" ? statusRaw.toLowerCase() : "new";

      if (status === "mới tạo" || !receiveMethod) c.new++;
      else if (status.includes("xử lý")) c.processing++;
      else if (status.includes("phản hồi")) c.responded++;
      else if (status.includes("hoàn tất")) c.completed++;
      else c.new++;
    });
    return c;
  }, [rows]);

  return (
    <>
      <Header title="Quản lý Báo giá" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="text-cyan-600" />
            Quản lý Báo giá
          </h1>
          <p className="text-sm text-gray-600">
            Quản lý và phản hồi các yêu cầu báo giá từ khách hàng
          </p>



          <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Can I="view_statistics" a='quotation'>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Tổng báo giá</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {total}
                  </div>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </Can>
            <Can I="view_statistics" a='quotation'>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Mới tạo</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {counts.new}
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Inbox className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Can>
            <Can I="view_statistics" a='quotation'>
              <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Đang xử lý</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {counts.processing}
                  </div>
                </div>
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Can>
              <Can I="view_statistics" a='quotation'>
            <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Hoàn thành</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {counts.completed}
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
              </Can>
          </div>
        </div>

        <QuotationFilters params={filters} onChange={setFilters} />
        {/* Tabs */}
        <div className="mt-6 mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === "all"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tất cả
            </div>
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === "customer"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Phản hồi Khách hàng
            </div>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === "admin"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Phản hồi Admin
            </div>
          </button>
        </div>

        <div className="mb-4">
          {isLoading && (
            <div className="p-4 bg-white rounded-lg shadow-sm border text-gray-600">
              Đang tải...
            </div>
          )}
          {isError && (
            <div className="p-4 bg-white rounded-lg shadow-sm border text-red-600">
              Lỗi khi tải dữ liệu
            </div>
          )}

          {!isLoading && !isError && (
            <QuotationTable
              rows={rows}
              onLoadMore={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
