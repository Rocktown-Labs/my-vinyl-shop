"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Vinyl } from "@/lib/db/schema"

// Fetch user's vinyls
export function useVinyls(type?: "collection" | "listings" | "all") {
  return useQuery({
    queryKey: ["vinyls", type],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (type) params.set("type", type)
      const res = await fetch(`/api/vinyls?${params}`)
      if (!res.ok) throw new Error("Failed to fetch vinyls")
      const data = await res.json()
      return data.vinyls as Vinyl[]
    },
  })
}

// Fetch single vinyl
export function useVinyl(id: string) {
  return useQuery({
    queryKey: ["vinyl", id],
    queryFn: async () => {
      const res = await fetch(`/api/vinyls/${id}`)
      if (!res.ok) throw new Error("Failed to fetch vinyl")
      const data = await res.json()
      return data.vinyl as Vinyl & { user: { displayName: string; username: string; avatarUrl: string } }
    },
    enabled: !!id,
  })
}

// Create vinyl mutation
export function useCreateVinyl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vinyl: Partial<Vinyl>) => {
      const res = await fetch("/api/vinyls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vinyl),
      })
      if (!res.ok) throw new Error("Failed to create vinyl")
      const data = await res.json()
      return data.vinyl as Vinyl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
    },
  })
}

// Update vinyl mutation
export function useUpdateVinyl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Vinyl> & { id: string }) => {
      const res = await fetch(`/api/vinyls/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update vinyl")
      const data = await res.json()
      return data.vinyl as Vinyl
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
      queryClient.invalidateQueries({ queryKey: ["vinyl", data.id] })
    },
  })
}

// Delete vinyl mutation
export function useDeleteVinyl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vinyls/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete vinyl")
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
    },
  })
}

// List vinyl mutation (convert collection to listing)
export function useListVinyl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      ...listingData
    }: {
      id: string
      price: number
      listingType?: string
      startingBid?: number
      reservePrice?: number
      buyNowPrice?: number
      auctionEndDate?: string
    }) => {
      const res = await fetch(`/api/vinyls/${id}/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      })
      if (!res.ok) throw new Error("Failed to list vinyl")
      const data = await res.json()
      return data.vinyl as Vinyl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
    },
  })
}

// Unlist vinyl mutation
export function useUnlistVinyl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vinyls/${id}/list`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to unlist vinyl")
      const data = await res.json()
      return data.vinyl as Vinyl
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] })
    },
  })
}
