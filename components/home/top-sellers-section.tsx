"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useHomeData } from "@/lib/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export function TopSellersSection() {
  const { data, isLoading } = useHomeData();

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-12">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-[140px] sm:w-auto aspect-[3/4] rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data?.topSellers || data.topSellers.length === 0) {
    return (
      <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4">Top Sellers</h2>
            <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-8">
              No sellers yet. Become the first top seller on the platform!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" asChild className="rounded-full">
                <Link href="/dashboard/listings/new">Start Selling</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link href="/sellers">View All Sellers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2">Top Sellers</h2>
            <p className="text-muted-foreground text-sm sm:text-lg">Follow collectors with exceptional taste</p>
          </div>
          <Button variant="ghost" asChild className="gap-2 hidden sm:flex">
            <Link href="/sellers">
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:overflow-visible scrollbar-hide">
          {data.topSellers.map((seller, i) => {
            const sellerLink = seller.username ? `/seller/${seller.username}` : `/seller/${seller.id}`;
            return (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-shrink-0 w-[140px] sm:w-auto"
              >
                <Link href={sellerLink}>
                  <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full !p-0">
                    <CardContent className="!p-0 relative aspect-[3/4]">
                      <Image
                        src={seller.avatarUrl || "/placeholder.svg"}
                        alt={seller.displayName || seller.username || "Seller"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {seller.displayName || seller.username || "Unknown"}
                          </h3>
                          {seller.isVerified && (
                            <Badge className="bg-white/20 text-white border-0 text-[9px] px-1.5 py-0 backdrop-blur-sm">
                              PRO
                            </Badge>
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
        <div className="mt-4 sm:hidden">
          <Button variant="ghost" asChild className="w-full gap-2">
            <Link href="/sellers">
              View all sellers
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
