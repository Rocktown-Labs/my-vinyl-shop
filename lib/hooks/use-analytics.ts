"use client";

import { useQuery } from "@tanstack/react-query";

export interface SalesMetrics {
  totalRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  averageOrderValue: number;
}

export interface OrderMetrics {
  total: number;
  byStatus: {
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  completionRate: number;
  week: number;
  month: number;
  year: number;
}

export interface ListingMetrics {
  active: number;
  total: number;
  averagePrice: number;
  bestSellingGenres: Array<{
    genre: string;
    sales: number;
    revenue: number;
  }>;
}

export interface EngagementMetrics {
  followers: number;
  messagesReceived: number;
}

export interface CollectionMetrics {
  totalItems: number;
  convertedToListings: number;
}

export interface TopSellingItem {
  vinylId: string;
  title: string;
  artist: string;
  quantitySold: number;
  revenue: number;
}

export interface AnalyticsData {
  sales: SalesMetrics;
  orders: OrderMetrics;
  listings: ListingMetrics;
  engagement: EngagementMetrics;
  collection: CollectionMetrics;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date | string;
  }>;
  topSellingItems: TopSellingItem[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json() as Promise<AnalyticsData>;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
