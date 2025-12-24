import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { StatsBar } from "@/components/home/stats-bar";
import { FeaturedVinylSection } from "@/components/home/featured-vinyl-section";
import { ShopByGenreSection } from "@/components/home/shop-by-genre-section";
import { FeaturesSection } from "@/components/home/features-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { PricingSection } from "@/components/home/pricing-section";
import { TopSellersSection } from "@/components/home/top-sellers-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <HeroSection />
        <Suspense fallback={null}>
          <StatsBar />
        </Suspense>
        <Suspense fallback={null}>
          <FeaturedVinylSection />
        </Suspense>
        <Suspense fallback={null}>
          <ShopByGenreSection />
        </Suspense>
        <FeaturesSection />
        <Suspense fallback={null}>
          <NewArrivalsSection />
        </Suspense>
        <PricingSection />
        <Suspense fallback={null}>
          <TopSellersSection />
        </Suspense>
        <CTASection />
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
