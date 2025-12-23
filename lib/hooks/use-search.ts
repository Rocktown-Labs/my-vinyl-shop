"use client";

import { useQuery } from "@tanstack/react-query";

export interface SearchResult {
  id: string;
  type: "vinyl" | "seller";
  title: string;
  subtitle: string;
  image?: string;
  metadata?: Record<string, any>;
  score?: number;
}

export function useSearch(query: string, enabled: boolean = true) {
  // Detect natural language queries (longer than 10 chars, contains spaces)
  const isNaturalLanguage = query.length > 10 && query.includes(" ");

  return useQuery({
    queryKey: ["search", query, isNaturalLanguage],
    queryFn: async () => {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&naturalLanguage=${isNaturalLanguage}`
      );
      if (!res.ok) throw new Error("Failed to search");
      const data = await res.json();
      return data.results as SearchResult[];
    },
    enabled: enabled && query.length > 0,
    staleTime: 30 * 1000,
  });
}
