"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

export interface FollowCounts {
  followers: number;
  following: number;
}

/**
 * Check if current user follows a target user
 */
export function useFollowStatus(targetUserId: string | null) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["follow", targetUserId],
    queryFn: async () => {
      if (!targetUserId || !isSignedIn) return { isFollowing: false };
      const res = await fetch(`/api/follow/${targetUserId}`);
      if (!res.ok) throw new Error("Failed to check follow status");
      return res.json() as Promise<{ isFollowing: boolean }>;
    },
    enabled: !!targetUserId && isSignedIn,
  });
}

/**
 * Get follower and following counts for a user
 */
export function useFollowCounts(userId: string | null) {
  return useQuery({
    queryKey: ["followCounts", userId],
    queryFn: async () => {
      if (!userId) return { followers: 0, following: 0 };
      const res = await fetch(`/api/follow/${userId}/counts`);
      if (!res.ok) throw new Error("Failed to fetch follow counts");
      return res.json() as Promise<FollowCounts>;
    },
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Follow a user mutation
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await fetch(`/api/follow/${targetUserId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to follow user");
      }
      return res.json() as Promise<{ isFollowing: boolean }>;
    },
    onSuccess: (data, targetUserId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["follow", targetUserId] });
      queryClient.invalidateQueries({
        queryKey: ["followCounts", targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["followCounts"] });
      queryClient.invalidateQueries({ queryKey: ["seller", targetUserId] });
    },
  });
}

/**
 * Unfollow a user mutation
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await fetch(`/api/follow/${targetUserId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to unfollow user");
      }
      return res.json() as Promise<{ isFollowing: boolean }>;
    },
    onSuccess: (data, targetUserId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["follow", targetUserId] });
      queryClient.invalidateQueries({
        queryKey: ["followCounts", targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["followCounts"] });
      queryClient.invalidateQueries({ queryKey: ["seller", targetUserId] });
    },
  });
}
