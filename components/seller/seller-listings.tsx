"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Grid3x3, LayoutList, Disc, Loader2, Lock } from "lucide-react";
import { VinylCard } from "@/components/vinyl-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import type { Vinyl } from "@/lib/db/schema";
import { useSellerCollection } from "@/lib/hooks/use-collection";
import { dbVinylToCardFormat } from "@/lib/utils/vinyl";

interface SellerListingsProps {
  sellerId: string;
}

export function SellerListings({ sellerId }: SellerListingsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data, isLoading } = useQuery({
    queryKey: ["seller", sellerId],
    queryFn: async () => {
      const res = await fetch(`/api/sellers/${sellerId}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch seller");
      }
      return res.json();
    },
  });

  // Get seller ID from data (in case we looked up by username)
  const actualSellerId = data?.seller?.id || sellerId;

  // Get collection data with infinite query (use actual seller ID)
  const {
    data: collectionData,
    isLoading: isLoadingCollection,
    fetchNextPage: fetchNextCollectionPage,
    hasNextPage: hasMoreCollection,
    isFetchingNextPage: isFetchingMoreCollection,
  } = useSellerCollection(actualSellerId);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
        <p className="text-muted-foreground">Seller not found</p>
      </div>
    );
  }

  const listings = (data?.listings || []) as Vinyl[];
  const collectionCount = data?.collection?.length || 0;

  const allCollectionItems =
    collectionData?.pages.flatMap((page) => page.collection) || [];
  const totalCollectionCount = collectionData?.pages[0]?.pagination.total || collectionCount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Tabs defaultValue="active" className="w-full">
        <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-border/40 pb-4 gap-4">
          <TabsList className="bg-transparent p-0 h-auto gap-4 sm:gap-6 overflow-x-auto">
            <TabsTrigger
              value="active"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Active ({listings.length})
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              <Disc className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Collection ({totalCollectionCount})
            </TabsTrigger>
            <TabsTrigger
              value="sold"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              Sold
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              About
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-1 shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
            >
              <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hidden sm:flex"
            >
              <LayoutList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="mt-0">
          {listings.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">No active listings</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {listings.map((vinyl) => {
                const vinylWithImages = {
                  ...vinyl,
                  images: typeof vinyl.images === "string" ? JSON.parse(vinyl.images) : vinyl.images || [],
                };
                return (
                  <VinylCard
                    key={vinyl.id}
                    vinyl={dbVinylToCardFormat(vinylWithImages as any)}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[300px]">Album</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((vinyl) => {
                    const images = vinyl.images ? JSON.parse(vinyl.images) : [];
                    const coverImage = images[0]?.url || "/placeholder.svg";
                    return (
                      <TableRow key={vinyl.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={coverImage}
                                alt={vinyl.title}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="line-clamp-1 font-medium">{vinyl.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{vinyl.artist}</TableCell>
                        <TableCell className="text-muted-foreground">{vinyl.year || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize font-normal">
                            {vinyl.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {vinyl.price ? `$${vinyl.price.toFixed(2)}` : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" className="rounded-full bg-transparent" asChild>
                            <Link href={`/product/${vinyl.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="collection" className="mt-0">
          {isLoadingCollection ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : allCollectionItems.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Disc className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                {data?.seller?.collectionPrivacy === "private"
                  ? "Collection is private"
                  : "No collection items"}
              </p>
              {data?.seller?.collectionPrivacy === "private" && (
                <Lock className="h-4 w-4 text-muted-foreground mx-auto" />
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {allCollectionItems.map((vinyl) => (
                  <VinylCard
                    key={vinyl.id}
                    vinyl={dbVinylToCardFormat(vinyl as any)}
                  />
                ))}
              </div>
              {hasMoreCollection && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <Button
                    onClick={() => fetchNextCollectionPage()}
                    disabled={isFetchingMoreCollection}
                    variant="outline"
                    className="rounded-full"
                  >
                    {isFetchingMoreCollection ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="sold">
          <div className="text-center py-16 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">No sold items to display</p>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {data?.seller?.bio && (
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">
                    About {data.seller.displayName || data.seller.username || "Seller"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{data.seller.bio}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {data?.seller?.createdAt && (
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
                    <p className="text-sm sm:text-base font-medium">
                      {new Date(data.seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {data?.seller?.location && (
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                    <p className="text-sm sm:text-base font-medium">{data.seller.location}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Listings</p>
                  <p className="text-sm sm:text-base font-medium">{listings.length} items</p>
                </div>
                {data?.collection && (
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Collection</p>
                    <p className="text-sm sm:text-base font-medium">{data.collection.length} items</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
