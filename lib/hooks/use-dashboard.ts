"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalRevenue: number;
  totalListings: number;
  totalOrders: number;
  pendingOrders: number;
  conversionRate: number;
}

export interface RecentListing {
  id: string;
  title: string;
  artist: string;
  condition: string;
  price: number | null;
  image: string | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentListings: RecentListing[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      return data as DashboardData;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}
