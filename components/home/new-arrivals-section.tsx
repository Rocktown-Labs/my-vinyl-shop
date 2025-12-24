"use client";

import { HorizontalScrollSection } from "@/components/horizontal-scroll-section";
import { VinylCard } from "@/components/vinyl-card";
import { useHomeData } from "@/lib/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";
import { dbVinylToCardFormat } from "@/lib/utils/vinyl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NewArrivalsSection() {
  const { data, isLoading } = useHomeData();

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-12">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="snap-start flex-shrink-0">
                <Skeleton className="w-[160px] sm:w-[280px] md:w-[300px] aspect-square rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data?.newArrivals || data.newArrivals.length === 0) {
    return (
      <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4">New Arrivals</h2>
            <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-8">
              No new listings yet. Check back soon or add your own!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" asChild className="rounded-full">
                <Link href="/dashboard/listings/new">List Your Records</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link href="/browse">Explore All</Link>
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
        <HorizontalScrollSection
          title="New Arrivals"
          subtitle="Fresh additions from our seller community"
          viewAllHref="/browse?sort=newest"
        >
          {data.newArrivals.map((vinyl) => (
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
