"use client";

import { Newspaper, Contact, Cog, BookText, Eye } from "lucide-react";
import StatCard from "./stat-card";
import type { OverviewDataItem } from "../hooks";

interface DashboardStatsProps {
  overviewData: OverviewDataItem[];
  totalViews: number;
}

export function DashboardStats({
  overviewData,
  totalViews,
}: DashboardStatsProps) {
  const getValueByKey = (key: string) =>
    overviewData.find((item) => item.key === key)?.value || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Tổng lượt xem"
        value={totalViews}
        change={15.3}
        icon={Eye}
      />
      <StatCard
        title="Tin tức"
        value={getValueByKey("news")}
        change={12.5}
        icon={Newspaper}
      />
      <StatCard
        title="Dịch vụ"
        value={getValueByKey("services")}
        change={-2.1}
        icon={Cog}
      />
      <StatCard
        title="Tài liệu"
        value={getValueByKey("documents")}
        change={5.3}
        icon={BookText}
      />
      <StatCard
        title="Liên hệ mới"
        value={getValueByKey("contacts")}
        change={8.2}
        icon={Contact}
      />
    </div>
  );
}
