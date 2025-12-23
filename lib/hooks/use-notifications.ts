"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Notification } from "@/lib/db/schema";

export interface EnrichedNotification extends Notification {
  metadata: Record<string, any>;
}

export function useNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["notifications", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.unreadOnly) params.set("unreadOnly", "true");
      if (options?.limit) params.set("limit", options.limit.toString());
      if (options?.offset) params.set("offset", options.offset.toString());

      const res = await fetch(`/api/notifications?${params}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      return {
        notifications: data.notifications as EnrichedNotification[],
        unreadCount: data.unreadCount as number,
      };
    },
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationIds,
      markAllAsRead,
    }: {
      notificationIds?: string[];
      markAllAsRead?: boolean;
    }) => {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds, markAllAsRead }),
      });
      if (!res.ok) throw new Error("Failed to mark notifications as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
