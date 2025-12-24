"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Vinyl } from "@/lib/db/schema";

export interface BrowseFilters {
  genre?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: string;
  search?: string;
  sort?: string;
}

export interface BrowseResponse {
  vinyls: Array<Vinyl & { images: Array<{ type: string; url: string }> }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function useBrowseVinyls(filters: BrowseFilters = {}) {
  return useInfiniteQuery({
    queryKey: ["browse", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("limit", "8");
      params.set("offset", String(pageParam * 8));

      if (filters.sort) params.set("sort", filters.sort);
      if (filters.genre) params.set("genre", filters.genre);
      if (filters.condition) params.set("condition", filters.condition);
      if (filters.minPrice !== undefined)
        params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined)
        params.set("maxPrice", String(filters.maxPrice));
      if (filters.year) params.set("year", filters.year);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/browse?${params}`);
      if (!res.ok) throw new Error("Failed to fetch vinyls");
      return res.json() as Promise<BrowseResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.hasMore) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
}
