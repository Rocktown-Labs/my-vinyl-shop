"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

export interface FollowerUser {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: Date;
}

export interface FollowersResponse {
  followers: FollowerUser[];
}

/**
 * Get followers list for a user (infinite query)
 */
export function useFollowers(userId: string | null) {
  return useInfiniteQuery({
    queryKey: ["followers", userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return { followers: [] };
      const params = new URLSearchParams();
      params.set("limit", "20");
      params.set("offset", String(pageParam * 20));

      const res = await fetch(`/api/follow/${userId}/followers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch followers");
      return res.json() as Promise<FollowersResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.followers.length === 20) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
}

/**
 * Get following list for a user (infinite query)
 */
export function useFollowing(userId: string | null) {
  return useInfiniteQuery({
    queryKey: ["following", userId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return { following: [] };
      const params = new URLSearchParams();
      params.set("limit", "20");
      params.set("offset", String(pageParam * 20));

      const res = await fetch(`/api/follow/${userId}/following?${params}`);
      if (!res.ok) throw new Error("Failed to fetch following");
      return res.json() as Promise<{ following: FollowerUser[] }>;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.following.length === 20) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!userId,
  });
}
