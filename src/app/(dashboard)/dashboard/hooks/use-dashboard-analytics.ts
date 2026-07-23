"use client";

import React from "react";
import {
  useGetApiV10AnalyticsTopPages,
  usePostApiV10AnalyticsMonthlyTraffic,
} from "@/api/endpoints/analytics";

export interface OverviewDataItem {
  name: string;
  key: string;
  value: number;
}

export interface MonthlyVisitData {
  month: string;
  visits: number;
  users: number;
  pageViews: number;
  fullMonth?: string;
}

export function useDashboardAnalytics() {
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );
  const [yearInput, setYearInput] = React.useState(
    new Date().getFullYear().toString()
  );

  // Fetch top pages analytics
  const { data: topPagesResponse, isLoading: topPagesLoading } =
    useGetApiV10AnalyticsTopPages();

  // Fetch monthly traffic data
  const {
    mutate: fetchMonthlyTraffic,
    data: monthlyTrafficResponse,
    isPending: monthlyTrafficLoading,
  } = usePostApiV10AnalyticsMonthlyTraffic();

  // Fetch monthly traffic data on component mount and when year changes
  React.useEffect(() => {
    fetchMonthlyTraffic({ data: { year: selectedYear } });
  }, [selectedYear, fetchMonthlyTraffic]);

  // Process top pages data and create overview data from real API
  const overviewData: OverviewDataItem[] = React.useMemo(() => {
    if (!Array.isArray(topPagesResponse?.responseData) || topPagesResponse.responseData.length === 0) {
      return [
        { name: "Tổng tin tức", key: "news", value: 145 },
        { name: "Dịch vụ", key: "services", value: 28 },
        { name: "Tài liệu", key: "documents", value: 89 },
        { name: "Liên hệ mới", key: "contacts", value: 140 },
      ];
    }

    // Group by page type and sum pageViews
    const groupedData = topPagesResponse.responseData.reduce((acc, item) => {
      let category = "other";
      if (item.pagePath?.includes("/news")) category = "news";
      else if (item.pagePath?.includes("/services")) category = "services";
      else if (item.pagePath?.includes("/documents")) category = "documents";
      else if (item.pagePath?.includes("/contact")) category = "contacts";
      else if (item.pagePath === "/") category = "homepage";

      if (!acc[category]) acc[category] = 0;
      acc[category] += item.pageViews || 0;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "Tin tức", key: "news", value: groupedData.news || 0 },
      { name: "Dịch vụ", key: "services", value: groupedData.services || 0 },
      { name: "Tài liệu", key: "documents", value: groupedData.documents || 0 },
      {
        name: "Liên hệ mới",
        key: "contacts",
        value: groupedData.contacts || 0,
      },
      { name: "Trang chủ", key: "homepage", value: groupedData.homepage || 0 },
    ];
  }, [topPagesResponse]);

  // Calculate total views
  const totalViews = React.useMemo(() => {
    return overviewData.reduce((sum, item) => sum + item.value, 0);
  }, [overviewData]);

  // Handle year input change
  const handleYearChange = () => {
    const year = parseInt(yearInput);
    if (year >= 2020 && year <= new Date().getFullYear() + 1) {
      setSelectedYear(year);
    }
  };

  // Process monthly traffic data for visits chart
  const monthlyVisitsData: MonthlyVisitData[] = React.useMemo(() => {
    if (!monthlyTrafficResponse?.responseData) {
      return [
        { month: "Jan", visits: 1200, users: 800, pageViews: 1500 },
        { month: "Feb", visits: 1500, users: 1000, pageViews: 1800 },
        { month: "Mar", visits: 1800, users: 1200, pageViews: 2200 },
        { month: "Apr", visits: 2100, users: 1400, pageViews: 2600 },
        { month: "May", visits: 1900, users: 1300, pageViews: 2300 },
        { month: "Jun", visits: 2300, users: 1500, pageViews: 2800 },
      ];
    }

    return monthlyTrafficResponse.responseData.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = item.month
        ? parseInt(item.month.split("-")[1]) - 1
        : 0;
      return {
        month: monthNames[monthIndex] || "Unknown",
        visits: item.sessions || 0,
        users: item.users || 0,
        pageViews: item.pageViews || 0,
        fullMonth: item.month || "",
      };
    });
  }, [monthlyTrafficResponse]);

  return {
    // Data
    overviewData,
    totalViews,
    monthlyVisitsData,
    // Loading states
    topPagesLoading,
    monthlyTrafficLoading,
    // Year controls
    selectedYear,
    yearInput,
    setYearInput,
    handleYearChange,
  };
}
