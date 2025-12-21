"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowRight,
  Disc3,
  ShieldCheck,
  TrendingUp,
  Star,
  ChevronRight,
  Play,
  Check,
  Sparkles,
  Gavel,
  Crown,
} from "lucide-react"
import Link from "next/link"
import { mockVinyls, mockSellers } from "@/lib/mock-data"
import { VinylCard } from "@/components/vinyl-card"
import { HorizontalScrollSection } from "@/components/horizontal-scroll-section"
import { motion } from "framer-motion"

export default function HomePage() {
  const featuredVinyls = mockVinyls.slice(0, 8)
  const newArrivals = mockVinyls.slice(2, 10)
  const topSellers = mockSellers.slice(0, 6)

  const genres = [
    { name: "Rock", count: "12.5K", color: "from-orange-500/20 to-red-500/20" },
    { name: "Jazz", count: "8.2K", color: "from-blue-500/20 to-indigo-500/20" },
    { name: "Soul", count: "6.1K", color: "from-pink-500/20 to-rose-500/20" },
    { name: "Hip-Hop", count: "9.8K", color: "from-violet-500/20 to-purple-500/20" },
    { name: "Electronic", count: "7.3K", color: "from-cyan-500/20 to-teal-500/20" },
    { name: "Blues", count: "4.5K", color: "from-amber-500/20 to-yellow-500/20" },
  ]

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual sellers and collectors",
      features: [
        "Up to 10 active listings",
        "Fixed price selling",
        "Basic seller profile",
        "Standard support",
        "5% transaction fee",
      ],
      cta: "Get Started",
      href: "/auth/signup",
      popular: false,
    },
    {
      name: "Vinyl Pro",
      price: "$9",
      period: "/month",
      description: "For serious sellers who want to grow",
      features: [
        "Unlimited listings",
        "Auction listings",
        "AI-powered listing creation",
        "Featured seller badge",
        "Priority support",
        "3% transaction fee",
        "Analytics dashboard",
      ],
      cta: "Start Free Trial",
      href: "/auth/signup?plan=pro",
      popular: true,
    },
    {
      name: "Crate Digger",
      price: "$24",
      period: "/month",
      description: "For power sellers and shops",
      features: [
        "Everything in Vinyl Pro",
        "Bulk listing tools",
        "Custom storefront URL",
        "API access",
        "1.5% transaction fee",
        "Dedicated account manager",
        "Early access to features",
      ],
      cta: "Contact Sales",
      href: "/auth/signup?plan=digger",
      popular: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/generated-20image-20december-2019-2c-202025-20-207-03pm.jpeg"
              alt="Vinyl record collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                <Badge className="mb-4 sm:mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium">
                  The Premier Vinyl Marketplace
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight text-balance leading-[1.1] mb-4 sm:mb-6"
              >
                Discover rare vinyl.
                <br />
                <span className="text-white/70">Connect with collectors.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl leading-relaxed mb-8 sm:mb-10"
              >
                Buy, sell, and showcase vinyl records in a curated marketplace designed for audiophiles and collectors.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button
                  size="lg"
                  asChild
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full"
                >
                  <Link href="/browse">
                    Browse Collection
                    <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                >
                  <Link href="/dashboard/listings/new">Start Selling</Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-2.5 rounded-full bg-white/60" />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="border-b bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              {[
                { value: "50K+", label: "Records Listed" },
                { value: "12K+", label: "Active Sellers" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "45+", label: "Countries" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vinyl */}
        <section className="py-12 sm:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HorizontalScrollSection
              title="Featured Vinyl"
              subtitle="Hand-picked records from our top sellers"
              viewAllHref="/browse"
            >
              {featuredVinyls.map((vinyl) => (
                <div key={vinyl.id} className="snap-start">
                  <VinylCard vinyl={vinyl} compact className="w-[160px] sm:w-[280px] md:w-[300px]" />
                </div>
              ))}
            </HorizontalScrollSection>
          </div>
        </section>

        <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4">Shop by Genre</h2>
              <p className="text-muted-foreground text-sm sm:text-lg">Find records that match your taste</p>
            </div>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {genres.map((genre, i) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 w-[120px] sm:w-[160px] lg:w-[180px]"
                >
                  <Link href={`/browse?genre=${genre.name.toLowerCase()}`}>
                    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <CardContent className={`p-4 sm:p-6 bg-gradient-to-br ${genre.color}`}>
                        <div className="aspect-square flex flex-col items-center justify-center text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-black flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-background flex items-center justify-center">
                              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black" />
                            </div>
                          </div>
                          <p className="font-semibold text-sm sm:text-base lg:text-lg">{genre.name}</p>
                          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5">
                            {genre.count} records
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">
                  Why my-vinyl.shop
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
                  The marketplace built for vinyl lovers
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                  Whether you're hunting for a rare first pressing or building your collection, we've created the
                  perfect platform for discovering and selling vinyl records.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: Disc3,
                      title: "AI-Powered Listings",
                      desc: "Upload photos and let AI identify your records automatically",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Secure Transactions",
                      desc: "Protected payments with buyer and seller guarantees",
                    },
                    {
                      icon: TrendingUp,
                      title: "Seller Profiles",
                      desc: "Build your brand with Instagram-style showcase pages",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 sm:gap-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-sm sm:text-base">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/vinyl-record-player-close-up-aesthetic.jpg"
                    alt="Vinyl record player"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-xl border">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Play className="h-6 w-6 text-accent ml-1" />
                    </div>
                    <div>
                      <p className="font-semibold">2.5M+</p>
                      <p className="text-sm text-muted-foreground">Records sold</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HorizontalScrollSection
              title="New Arrivals"
              subtitle="Fresh additions from our seller community"
              viewAllHref="/browse?sort=newest"
            >
              {newArrivals.map((vinyl) => (
                <div key={vinyl.id} className="snap-start">
                  <VinylCard vinyl={vinyl} compact className="w-[160px] sm:w-[280px] md:w-[300px]" />
                </div>
              ))}
            </HorizontalScrollSection>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 sm:py-20 lg:py-28" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <Badge variant="secondary" className="mb-4">
                Pricing
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
                Start selling for free, upgrade when you're ready to unlock auctions, AI tools, and lower fees.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={`relative h-full border-0 shadow-lg ${tier.popular ? "ring-2 ring-primary shadow-xl" : ""}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="px-4 py-1 text-xs font-semibold">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2 pt-8">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                        {tier.name === "Free" && <Disc3 className="h-6 w-6 text-accent" />}
                        {tier.name === "Vinyl Pro" && <Sparkles className="h-6 w-6 text-accent" />}
                        {tier.name === "Crate Digger" && <Crown className="h-6 w-6 text-accent" />}
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription className="text-sm">{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <span className="text-4xl sm:text-5xl font-bold">{tier.price}</span>
                        <span className="text-muted-foreground text-sm">{tier.period}</span>
                      </div>
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {tier.name === "Vinyl Pro" && (
                          <li className="flex items-start gap-3 text-sm">
                            <Gavel className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="font-medium">Auction listings included</span>
                          </li>
                        )}
                      </ul>
                      <Button
                        asChild
                        className={`w-full rounded-full ${tier.popular ? "" : "bg-muted text-foreground hover:bg-muted/80"}`}
                        variant={tier.popular ? "default" : "secondary"}
                      >
                        <Link href={tier.href}>{tier.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-12">
              All plans include secure payments, buyer protection, and access to our global marketplace.
            </p>
          </div>
        </section>

        {/* Top Sellers */}
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
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:overflow-visible scrollbar-hide">
              {topSellers.map((seller, i) => (
                <motion.div
                  key={seller.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 w-[140px] sm:w-auto"
                >
                  <Link href={`/seller/${seller.id}`}>
                    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                      <CardContent className="p-0 relative aspect-[3/4]">
                        {/* Full-bleed background image */}
                        <img
                          src={seller.avatar || "/placeholder.svg?height=400&width=300&query=vinyl+collector+portrait"}
                          alt={seller.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{seller.name}</h3>
                            {seller.verified && (
                              <Badge className="bg-white/20 text-white border-0 text-[9px] px-1.5 py-0 backdrop-blur-sm">
                                PRO
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/80">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{seller.rating}</span>
                            </div>
                            <span>{seller.totalSales} sales</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
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

        {/* CTA Section */}
        <section className="py-12 sm:py-20 lg:py-28 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-balance">
                  Ready to start your vinyl journey?
                </h2>
                <p className="text-sm sm:text-lg text-background/70 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
                  Join thousands of collectors buying and selling records on the world's most thoughtful vinyl
                  marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full"
                  >
                    <Link href="/auth/signup">Create Free Account</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full border-background/30 text-background hover:bg-background/10 hover:text-background bg-transparent"
                  >
                    <Link href="/browse">Explore Records</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
