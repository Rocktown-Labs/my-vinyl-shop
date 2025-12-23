"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/lib/db/schema";

export interface EnrichedOrder extends Order {
  vinyl: {
    id: string;
    title: string;
    artist: string;
    price: number | null;
    image: string | null;
  } | null;
  buyer: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  seller: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
  shippingAddress: any;
}

export function useOrders(options?: {
  role?: "buyer" | "seller";
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["orders", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.role) params.set("role", options.role);
      if (options?.status) params.set("status", options.status);
      if (options?.limit) params.set("limit", options.limit.toString());
      if (options?.offset) params.set("offset", options.offset.toString());

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      return data.orders as EnrichedOrder[];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      return data.order as EnrichedOrder;
    },
    enabled: !!id,
  });
}
