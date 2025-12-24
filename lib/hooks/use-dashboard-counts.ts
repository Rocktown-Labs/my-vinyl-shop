"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardCounts {
  notifications: number;
  messages: number;
  orders: number;
}

export function useDashboardCounts() {
  return useQuery({
    queryKey: ["dashboard", "counts"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/counts");
      if (!res.ok) throw new Error("Failed to fetch counts");
      return res.json() as Promise<DashboardCounts>;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}
