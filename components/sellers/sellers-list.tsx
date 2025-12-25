"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Package, Disc, TrendingUp, MapPin, Globe } from "lucide-react";
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
  stats?: {
    listings: number;
    collection: number;
    sales: number;
  };
}

interface SellersListProps {
  initialData?: Seller[];
  searchQuery: string;
  selectedCountries: string[];
  selectedGenres: string[];
  minRating: number;
  verifiedOnly: boolean;
  shipsWorldwide: boolean;
}

export function SellersList({
  initialData,
  searchQuery,
  selectedCountries,
  selectedGenres,
  minRating,
  verifiedOnly,
  shipsWorldwide,
}: SellersListProps) {
  const { userId } = useAuth();

  // Check if any filters are applied
  const hasFilters = searchQuery || selectedCountries.length > 0 || selectedGenres.length > 0 || verifiedOnly || shipsWorldwide;

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
    initialData: !hasFilters && initialData ? initialData : undefined,
    enabled: hasFilters || !initialData, // Fetch if filters are applied or no initial data
    staleTime: 60 * 1000, // 1 minute
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
    const sellersData = data || initialData || [];
    if (!sellersData.length) return [];

    let filtered = [...sellersData];

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

  // Show loading only if we don't have initial data
  if (isLoading && !initialData) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm">
            <Skeleton className="aspect-[3/4] w-full" />
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {filteredSellers.map((seller, i) => {
        const genres = seller.specializedGenres ? JSON.parse(seller.specializedGenres) : [];
        const isCurrentUser = seller.id === userId;
        const sellerLink = seller.username ? `/seller/${seller.username}` : `/seller/${seller.id}`;
        const stats = seller.stats || { listings: 0, collection: 0, sales: 0 };
        const displayLocation = seller.location || seller.country || null;

        return (
          <motion.div
            key={seller.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex-shrink-0"
          >
            <Link href={sellerLink}>
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full !p-0">
                <CardContent className="!p-0 relative h-full">
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted w-full h-full">
                    <Image
                      src={seller.avatarUrl || "/placeholder.svg"}
                      alt={seller.displayName || seller.username || "Seller"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    
                    {/* Badges - Top */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1.5 z-10">
                      {isCurrentUser && (
                        <Badge className="bg-primary/95 text-primary-foreground border-0 text-[10px] px-1.5 py-0.5 font-medium shadow-sm">
                          You
                        </Badge>
                      )}
                      <div className="flex gap-1.5 ml-auto">
                        {seller.isVerified && (
                          <Badge className="bg-emerald-500/95 text-white border-0 text-[10px] px-1.5 py-0.5 font-medium shadow-sm">
                            <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                            Verified
                          </Badge>
                        )}
                        {seller.shipsWorldwide && (
                          <Badge className="bg-blue-500/95 text-white border-0 text-[10px] px-1.5 py-0.5 font-medium shadow-sm">
                            <Globe className="h-2.5 w-2.5" />
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 text-white z-10">
                      <h3 className="font-bold text-sm sm:text-base leading-tight mb-0.5 sm:mb-1 line-clamp-1 drop-shadow-md">
                        {seller.displayName || seller.username || "Unknown"}
                      </h3>
                      {displayLocation && (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs opacity-90 mb-1.5 sm:mb-2">
                          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{displayLocation}</span>
                        </div>
                      )}
                      
                      {/* Genres - Compact */}
                      {genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5 sm:mb-2">
                          {genres.slice(0, 2).map((genre: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 font-normal bg-white/20 text-white border-0 backdrop-blur-sm"
                            >
                              {genre}
                            </Badge>
                          ))}
                          {genres.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] sm:text-[10px] px-1.5 py-0.5 font-normal bg-white/20 text-white border-0 backdrop-blur-sm"
                            >
                              +{genres.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats - Compact Row */}
                      <div className="flex items-center gap-2 sm:gap-3 pt-1.5 sm:pt-2 border-t border-white/20">
                        <div className="flex items-center gap-1">
                          <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-80" />
                          <span className="text-[10px] sm:text-xs font-semibold">{stats.listings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Disc className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-80" />
                          <span className="text-[10px] sm:text-xs font-semibold">{stats.collection}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-80" />
                          <span className="text-[10px] sm:text-xs font-semibold">{stats.sales}</span>
                        </div>
                      </div>
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
