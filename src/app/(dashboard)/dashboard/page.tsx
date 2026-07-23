"use client";

import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { DashboardStats, OverviewChart, VisitsChart } from "./components";
import { useDashboardAnalytics } from "./hooks";

export default function DashboardPage() {
  const {
    overviewData,
    totalViews,
    monthlyVisitsData,
    topPagesLoading,
    monthlyTrafficLoading,
    selectedYear,
    yearInput,
    setYearInput,
    handleYearChange,
  } = useDashboardAnalytics();

  return (
    <div>
      <Header title="Dashboard" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back! Here&apos;s an overview of your business.
              </p>
            </div>
            <Badge variant="outline">
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>

          {/* Stats Cards */}
          <DashboardStats overviewData={overviewData} totalViews={totalViews} />

          {/* Overview Chart */}
          <OverviewChart data={overviewData} isLoading={topPagesLoading} />

          {/* Visits Trend Chart */}
          <VisitsChart
            data={monthlyVisitsData}
            isLoading={monthlyTrafficLoading}
            selectedYear={selectedYear}
            yearInput={yearInput}
            onYearInputChange={setYearInput}
            onYearChange={handleYearChange}
          />
        </div>
      </main>
    </div>
  );
}
