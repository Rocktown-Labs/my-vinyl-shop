"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SellerProfile } from "@/components/seller/seller-profile";
import { SellerListings } from "@/components/seller/seller-listings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SellerProfileSkeleton() {
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

function SellerListingsSkeleton() {
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

export default function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Suspense fallback={<SellerProfileSkeleton />}>
          <SellerProfile sellerIdOrUsername={id} />
        </Suspense>
        <Suspense fallback={<SellerListingsSkeleton />}>
          <SellerListings sellerId={id} />
        </Suspense>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
