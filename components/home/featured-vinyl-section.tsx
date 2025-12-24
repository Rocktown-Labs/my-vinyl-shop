"use client";

import { HorizontalScrollSection } from "@/components/horizontal-scroll-section";
import { VinylCard } from "@/components/vinyl-card";
import { useHomeData } from "@/lib/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";
import { dbVinylToCardFormat } from "@/lib/utils/vinyl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturedVinylSection() {
  const { data, isLoading } = useHomeData();

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-12">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="snap-start flex-shrink-0">
                <Skeleton className="w-[160px] sm:w-[280px] md:w-[300px] aspect-square rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data?.featuredVinyls || data.featuredVinyls.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HorizontalScrollSection
          title="Featured Vinyl"
          subtitle="Hand-picked records from our top sellers"
          viewAllHref="/browse"
        >
          {data.featuredVinyls.map((vinyl) => (
            <div key={vinyl.id} className="snap-start">
              <VinylCard
                vinyl={dbVinylToCardFormat({
                  ...vinyl,
                  images: JSON.stringify(vinyl.images),
                } as any)}
                compact
                className="w-[160px] sm:w-[280px] md:w-[300px]"
              />
            </div>
          ))}
        </HorizontalScrollSection>
      </div>
    </section>
  );
}
