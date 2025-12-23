"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, MapPin, Calendar, Share2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface SellerProfileProps {
  sellerIdOrUsername: string;
}

export function SellerProfile({ sellerIdOrUsername }: SellerProfileProps) {
  const { userId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["seller", sellerIdOrUsername],
    queryFn: async () => {
      const res = await fetch(`/api/sellers/${sellerIdOrUsername}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch seller");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-16 items-center sm:items-start">
            <Skeleton className="h-32 w-32 sm:h-40 sm:w-40 rounded-full" />
            <div className="flex-1 space-y-4 w-full">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.seller) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center px-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Seller not found</h1>
            <Button asChild className="rounded-full">
              <Link href="/sellers">Browse Sellers</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const seller = data.seller;
  const isCurrentUser = seller.id === userId;
  const genres = seller.specializedGenres || [];

  return (
    <div className="border-b border-border/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-16 items-center sm:items-start">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 border-4 border-background shadow-xl">
            <AvatarImage src={seller.avatarUrl || "/placeholder.svg"} alt={seller.displayName || seller.username || "Seller"} />
            <AvatarFallback className="text-2xl sm:text-4xl font-semibold bg-accent text-accent-foreground">
              {(seller.displayName || seller.username || "U").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4 sm:space-y-6 text-center sm:text-left w-full">
            <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-3 sm:gap-4">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    {seller.displayName || seller.username || "Unknown"}
                  </h1>
                  {seller.isVerified && (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent fill-accent/20" />
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  @{seller.username || "no-username"}
                </p>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                {isCurrentUser ? (
                  <Button variant="outline" className="rounded-full px-5 sm:px-6 h-9 sm:h-10 text-sm" asChild>
                    <Link href="/dashboard/profile">Edit Profile</Link>
                  </Button>
                ) : (
                  <Button variant="default" className="rounded-full px-5 sm:px-6 h-9 sm:h-10 text-sm">
                    Follow
                  </Button>
                )}
                <Button variant="outline" size="icon" className="rounded-full bg-transparent h-9 w-9 sm:h-10 sm:w-10">
                  <Share2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full bg-transparent h-9 w-9 sm:h-10 sm:w-10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {!isCurrentUser && <DropdownMenuItem>Block</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">{data.listings?.length || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">{data.collection?.length || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Collection</p>
              </div>
            </div>

            {/* Bio */}
            {seller.bio && (
              <p className="text-sm sm:text-base leading-relaxed max-w-2xl">{seller.bio}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              {seller.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{seller.location}</span>
                </div>
              )}
              {seller.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    Joined{" "}
                    {new Date(seller.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {genres.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span>Specializes in: {genres.slice(0, 3).join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
