"use client"

import { useQuery } from "@tanstack/react-query"
import type { User, Vinyl } from "@/lib/db/schema"

interface SellerWithGenres extends Omit<User, "specializedGenres"> {
  specializedGenres: string[]
}

// Fetch all sellers
export function useSellers(filters?: {
  search?: string
  country?: string
  genre?: string
  verified?: boolean
  worldwide?: boolean
}) {
  return useQuery({
    queryKey: ["sellers", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.search) params.set("search", filters.search)
      if (filters?.country) params.set("country", filters.country)
      if (filters?.genre) params.set("genre", filters.genre)
      if (filters?.verified) params.set("verified", "true")
      if (filters?.worldwide) params.set("worldwide", "true")

      const res = await fetch(`/api/sellers?${params}`)
      if (!res.ok) throw new Error("Failed to fetch sellers")
      const data = await res.json()
      return data.sellers as SellerWithGenres[]
    },
  })
}

// Fetch single seller with listings
export function useSeller(id: string) {
  return useQuery({
    queryKey: ["seller", id],
    queryFn: async () => {
      const res = await fetch(`/api/sellers/${id}`)
      if (!res.ok) throw new Error("Failed to fetch seller")
      const data = await res.json()
      return data as {
        seller: SellerWithGenres
        listings: Vinyl[]
        collection: Vinyl[]
      }
    },
    enabled: !!id,
  })
}
