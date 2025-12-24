"use client";

import { useQuery } from "@tanstack/react-query";

export interface HomeData {
  featuredVinyls: Array<{
    id: string;
    title: string;
    artist: string;
    genre: string;
    year: number | null;
    price: number | null;
    condition: string;
    images: Array<{ type: string; url: string }>;
    userId: string;
    createdAt: Date;
  }>;
  newArrivals: Array<{
    id: string;
    title: string;
    artist: string;
    genre: string;
    year: number | null;
    price: number | null;
    condition: string;
    images: Array<{ type: string; url: string }>;
    userId: string;
    createdAt: Date;
  }>;
  topSellers: Array<{
    id: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    specializedGenres: string[];
    isVerified: boolean;
  }>;
  stats: {
    totalListings: number;
    totalSellers: number;
    totalOrders: number;
    satisfactionRate: string;
    countries: string;
  };
  genres: Array<{
    name: string;
    count: number;
  }>;
}

export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await fetch("/api/home");
      if (!res.ok) throw new Error("Failed to fetch homepage data");
      return res.json() as Promise<HomeData>;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
