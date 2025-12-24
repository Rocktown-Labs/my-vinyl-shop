"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Vinyl } from "@/lib/db/schema";

export interface CollectionResponse {
  collection: Array<Vinyl & { images: Array<{ type: string; url: string }> }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Get seller's collection (infinite query)
 */
export function useSellerCollection(sellerIdOrUsername: string | null) {
  return useInfiniteQuery({
    queryKey: ["sellerCollection", sellerIdOrUsername],
    queryFn: async ({ pageParam = 0 }) => {
      if (!sellerIdOrUsername)
        return {
          collection: [],
          pagination: { total: 0, limit: 8, offset: 0, hasMore: false },
        };
      const params = new URLSearchParams();
      params.set("limit", "8");
      params.set("offset", String(pageParam * 8));

      const res = await fetch(
        `/api/sellers/${sellerIdOrUsername}/collection?${params}`
      );
      if (!res.ok) {
        if (res.status === 403) {
          return {
            collection: [],
            pagination: { total: 0, limit: 8, offset: 0, hasMore: false },
          };
        }
        throw new Error("Failed to fetch collection");
      }
      return res.json() as Promise<CollectionResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.pagination.hasMore) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!sellerIdOrUsername,
  });
}
