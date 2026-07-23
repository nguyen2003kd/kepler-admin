"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MonthlyVisitData } from "../hooks";

const chartConfig: ChartConfig = {
  visits: { label: "Visits", color: "#06b6d4" },
  pageViews: { label: "Page Views", color: "#8b5cf6" },
};

interface VisitsChartProps {
  data: MonthlyVisitData[];
  isLoading: boolean;
  selectedYear: number;
  yearInput: string;
  onYearInputChange: (value: string) => void;
  onYearChange: () => void;
}

export function VisitsChart({
  data,
  isLoading,
  selectedYear,
  yearInput,
  onYearInputChange,
  onYearChange,
}: VisitsChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Số lượng truy cập theo tháng</CardTitle>
            <CardDescription>
              Thống kê truy cập năm {selectedYear}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Năm"
              value={yearInput}
              onChange={(e) => onYearInputChange(e.target.value)}
              className="w-20"
              min="2020"
              max={new Date().getFullYear() + 1}
            />
            <Button
              onClick={onYearChange}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Nhập
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px] w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{`${label} ${selectedYear}`}</p>
                            <p className="text-cyan-500">
                              {`Phiên: ${d.visits?.toLocaleString()}`}
                            </p>
                            <p className="text-purple-500">
                              {`Người dùng: ${d.users?.toLocaleString()}`}
                            </p>
                            <p className="text-amber-500">
                              {`Lượt xem: ${d.pageViews?.toLocaleString()}`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="var(--color-visits)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Phiên"
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-pageViews)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Người dùng"
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Lượt xem"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-3 space-y-1 text-sm w-full max-w-md">
              {data.map((d, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "#06b6d4" }}
                    />
                    <span>{d.month}</span>
                  </div>
                  <div className="font-mono tabular-nums ml-2 flex gap-4">
                    <span className="text-cyan-600">
                      {d.visits.toLocaleString()}
                    </span>
                    <span className="text-purple-600">
                      {d.users.toLocaleString()}
                    </span>
                    <span className="text-amber-600">
                      {d.pageViews.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#06b6d4" }}
                  />
                  <span className="font-semibold">Tổng</span>
                </div>
                <div className="font-mono tabular-nums ml-2 font-semibold flex gap-4">
                  <span className="text-cyan-600">
                    {data
                      .reduce((total, d) => total + d.visits, 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-purple-600">
                    {data
                      .reduce((total, d) => total + d.users, 0)
                      .toLocaleString()}
                  </span>
                  <span className="text-amber-600">
                    {data
                      .reduce((total, d) => total + d.pageViews, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
