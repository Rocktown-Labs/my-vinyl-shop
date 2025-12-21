"use client"

import { useQuery } from "@tanstack/react-query"
import type { SearchResult } from "@/lib/search"

export function useSearch(query: string, options?: { type?: "vinyl" | "seller"; enabled?: boolean }) {
  return useQuery({
    queryKey: ["search", query, options?.type],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("q", query)
      if (options?.type) params.set("type", options.type)

      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      return data.results as SearchResult[]
    },
    enabled: (options?.enabled ?? true) && query.length >= 2,
  })
}
