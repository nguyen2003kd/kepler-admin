"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { useGetApiV10QuotationStatus } from "@/api/endpoints/quotation-status";

type Props = {
  params: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

export default function QuotationFilters({ params, onChange }: Props) {
  const { data: statusResp, isLoading: isStatusLoading } =
    useGetApiV10QuotationStatus();

  // Helper to safely get string values from unknown objects
  const getString = (
    obj: Record<string, unknown> | undefined,
    ...keys: string[]
  ): string => {
    if (!obj) return "";
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
    }
    return "";
  };

  // Helper to safely get rows from response
  const getRowsFromResp = (resp: unknown): Record<string, unknown>[] => {
    if (!resp || typeof resp !== "object") return [];
    const r = resp as { responseData?: { rows?: unknown[] } };
    const rows = r.responseData?.rows ?? [];
    return Array.isArray(rows)
      ? rows.map((row) => row as Record<string, unknown>)
      : [];
  };

  // Build filter string for backend (format: field==value;field2==value2)
  const buildFilterString = (
    currentFilters: Record<string, unknown>,
  ): string => {
    const parts: string[] = [];

    if (currentFilters.quotation_status_id) {
      parts.push(`quotation_status_id==${currentFilters.quotation_status_id}`);
    }
    if (currentFilters.service) {
      parts.push(`service~~${currentFilters.service}`);
    }
    if (currentFilters.q) {
      // Search in name or email (name~~${currentFilters.q},
      parts.push(`(email|name)==${currentFilters.q}`);
    }
    if (currentFilters.from) {
      parts.push(`created_at>=${currentFilters.from}`);
    }

    return parts.join(",");
  };

  const update = (patch: Partial<Record<string, unknown>>) => {
    const newFilters = { ...params, ...patch };

    const filtersString = buildFilterString(newFilters);

    onChange({
      ...newFilters,
      filters: filtersString || undefined,
      page: newFilters.page || 1,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Bộ lọc</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="w-full outline-none text-gray-900"
            placeholder="Tìm khách hàng, email..."
            value={getString(params, "q")}
            onChange={(e) => update({ q: e.target.value })}
          />
        </div>

        <select
          className="px-3 py-2 border rounded-lg text-gray-900 bg-white"
          value={getString(params, "quotation_status_id")}
          onChange={(e) =>
            update({ quotation_status_id: e.target.value || undefined })
          }
          disabled={isStatusLoading}
        >
          <option value="">
            {isStatusLoading ? "Đang tải..." : "Tất cả trạng thái"}
          </option>
          {getRowsFromResp(statusResp).map((m, idx) => {
            const val = getString(m, "id", "quotation_status_id", "name");
            const label = getString(m, "name", "title", "label", "id") || val;
            return (
              <option key={val || String(idx)} value={val}>
                {label}
              </option>
            );
          })}
        </select>
{/* 
        <input
          className="px-3 py-2 border rounded-lg text-gray-900"
          placeholder="Tất cả dịch vụ"
          value={getString(params, "service")}
          onChange={(e) => update({ service: e.target.value })}
        />

        <input
          type="date"
          className="px-3 py-2 border rounded-lg text-gray-900"
          placeholder="mm/dd/yyyy"
          value={getString(params, "from")}
          onChange={(e) => update({ from: e.target.value || undefined })}
        /> */}
      </div>
    </div>
  );
}
