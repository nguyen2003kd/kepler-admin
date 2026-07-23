"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Eye } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { OverviewDataItem } from "../hooks";

const overviewChartConfig: ChartConfig = {
  news: { label: "Tin tức", color: "#10b981" },
  services: { label: "Dịch vụ", color: "#6366f1" },
  documents: { label: "Tài liệu", color: "#f59e0b" },
  contacts: { label: "Liên hệ mới", color: "#ef4444" },
  homepage: { label: "Trang chủ", color: "#8b5cf6" },
};

interface OverviewChartProps {
  data: OverviewDataItem[];
  isLoading: boolean;
}

export function OverviewChart({ data, isLoading }: OverviewChartProps) {
  const filteredData = data.filter((item) => item.value > 0);
  const totalViews = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Tổng quan lượt xem
        </CardTitle>
        <CardDescription>
          Biểu đồ cho Tin tức, Dịch vụ, Tài liệu và Liên hệ mới
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-[280px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={overviewChartConfig}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {filteredData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={`var(--color-${entry.key})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{d.name}</p>
                            <p className="text-sm">
                              Lượt xem:{" "}
                              <span className="font-bold">
                                {d.value.toLocaleString()}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-3 space-y-1 text-sm w-full max-w-md">
              {filteredData.map((d) => (
                <div
                  key={d.key}
                  className="flex items-center justify-between px-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          overviewChartConfig[
                            d.key as keyof typeof overviewChartConfig
                          ]?.color || "#gray",
                      }}
                    />
                    <span>{d.name}</span>
                  </div>
                  <div className="font-mono tabular-nums ml-8">
                    {d.value.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-border font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-sm">Tổng lượt xem</span>
                </div>
                <div className="font-mono text-sm tabular-nums">
                  {totalViews.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
