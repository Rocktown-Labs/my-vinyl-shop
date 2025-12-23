"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

interface Seller {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  country: string | null;
  isVerified: boolean;
  shipsWorldwide: boolean;
  specializedGenres: string | null;
  createdAt: Date;
}

interface SellersListProps {
  searchQuery: string;
  selectedCountries: string[];
  selectedGenres: string[];
  minRating: number;
  verifiedOnly: boolean;
  shipsWorldwide: boolean;
}

export function SellersList({
  searchQuery,
  selectedCountries,
  selectedGenres,
  minRating,
  verifiedOnly,
  shipsWorldwide,
}: SellersListProps) {
  const { userId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["sellers", searchQuery, selectedCountries, selectedGenres, verifiedOnly, shipsWorldwide],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCountries.length > 0) params.set("country", selectedCountries[0]);
      if (selectedGenres.length > 0) params.set("genre", selectedGenres[0]);
      if (verifiedOnly) params.set("verified", "true");
      if (shipsWorldwide) params.set("worldwide", "true");

      const res = await fetch(`/api/sellers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch sellers");
      const data = await res.json();
      return data.sellers as Seller[];
    },
  });

  // Get current user to show them first if they're a seller
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    },
    enabled: !!userId,
  });

  const filteredSellers = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    // Apply client-side filters (API does some, but we refine here)
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((s) => s.country && selectedCountries.includes(s.country));
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter((s) => {
        const genres = s.specializedGenres ? JSON.parse(s.specializedGenres) : [];
        return selectedGenres.some((g) => genres.includes(g));
      });
    }

    // Separate current user if they're a seller
    const currentUserSeller = currentUser?.isSeller && currentUser?.onboardingCompleted
      ? filtered.find((s) => s.id === userId)
      : null;

    const otherSellers = filtered.filter((s) => s.id !== userId);

    // Put current user first if they exist
    return currentUserSeller ? [currentUserSeller, ...otherSellers] : otherSellers;
  }, [data, selectedCountries, selectedGenres, currentUser, userId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm">
            <Skeleton className="aspect-[3/4]" />
          </Card>
        ))}
      </div>
    );
  }

  if (!filteredSellers || filteredSellers.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No sellers found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {filteredSellers.map((seller, i) => {
        const genres = seller.specializedGenres ? JSON.parse(seller.specializedGenres) : [];
        const isCurrentUser = seller.id === userId;
        const sellerLink = seller.username ? `/seller/${seller.username}` : `/seller/${seller.id}`;

        return (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex-shrink-0"
          >
            <Link href={sellerLink}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-0 relative">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={seller.avatarUrl || "/placeholder.svg"}
                      alt={seller.displayName || seller.username || "Seller"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {seller.isVerified && (
                      <Badge className="absolute top-2 right-2 bg-emerald-500/90 text-white border-0 text-[10px] px-1.5">
                        <CheckCircle2 className="h-3 w-3 mr-0.5" />
                        Verified
                      </Badge>
                    )}
                    {isCurrentUser && (
                      <Badge className="absolute top-2 left-2 bg-primary/90 text-white border-0 text-[10px] px-1.5">
                        You
                      </Badge>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="font-bold text-sm sm:text-base leading-tight line-clamp-1">
                        {seller.displayName || seller.username || "Unknown"}
                      </h3>
                      <p className="text-xs opacity-80 line-clamp-1">
                        {seller.location || seller.country || "Location not set"}
                      </p>
                      {genres.length > 0 && (
                        <p className="text-xs opacity-60 mt-1 line-clamp-1">
                          {genres.slice(0, 2).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
