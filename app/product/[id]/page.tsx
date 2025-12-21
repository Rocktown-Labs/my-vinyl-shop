"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart, Share2, Disc, Package, ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockVinyls, mockSellers } from "@/lib/mock-data"
import { VinylCard } from "@/components/vinyl-card"
import { motion, AnimatePresence } from "motion/react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const vinyl = mockVinyls.find((v) => v.id === id)
  const seller = vinyl ? mockSellers.find((s) => s.id === vinyl.sellerId) : null
  const relatedVinyls = mockVinyls.filter((v) => v.genre === vinyl?.genre && v.id !== id).slice(0, 4)

  const [selectedImage, setSelectedImage] = useState(0)

  if (!vinyl || !seller) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center px-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Product not found</h1>
            <Button asChild className="rounded-full">
              <Link href="/browse">Browse Collection</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </div>
    )
  }

  const images = [
    { src: vinyl.images.frontCover, label: "Front Cover" },
    { src: vinyl.images.backCover, label: "Back Cover" },
    { src: vinyl.images.vinyl, label: "Vinyl" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage].src}
                    alt={images[selectedImage].label}
                    className="object-cover w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              </motion.div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${
                      selectedImage === index ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.label}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-balance mb-1 sm:mb-2">{vinyl.title}</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground">{vinyl.artist}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
                  <Badge variant="secondary">{vinyl.genre}</Badge>
                  <Badge variant="outline">{vinyl.year}</Badge>
                  <Badge variant="secondary" className="capitalize">
                    {vinyl.condition}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold">${vinyl.price}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">+ shipping</span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <Button size="lg" className="flex-1 h-11 sm:h-12 rounded-full">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline" className="h-11 sm:h-12 rounded-full bg-transparent">
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Seller Info */}
              <Link href={`/seller/${seller.id}`}>
                <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                      <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm sm:text-base truncate">{seller.name}</p>
                        {seller.verified && (
                          <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{seller.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm sm:text-base font-semibold">{seller.rating}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Rating</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Product Info Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-10 sm:h-11">
                  <TabsTrigger value="details" className="text-xs sm:text-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="text-xs sm:text-sm">
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger value="returns" className="text-xs sm:text-sm">
                    Returns
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-2 text-sm">
                    <p className="leading-relaxed">{vinyl.description}</p>
                    {vinyl.pressInfo && (
                      <div className="pt-4">
                        <h4 className="font-semibold mb-2">Press Information</h4>
                        <ul className="space-y-1 text-muted-foreground text-xs sm:text-sm">
                          <li>Press: {vinyl.pressInfo}</li>
                          {vinyl.catalogNumber && <li>Catalog Number: {vinyl.catalogNumber}</li>}
                          {vinyl.label && <li>Label: {vinyl.label}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Standard Shipping</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Estimated delivery in 5-7 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Disc className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Secure Packaging</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          All vinyl records are carefully packaged to prevent damage
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="returns" className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">30-Day Returns</p>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Not satisfied? Return within 30 days for a full refund
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Related Products - Horizontal scroll on mobile */}
          {relatedVinyls.length > 0 && (
            <section className="mt-12 sm:mt-20">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">More {vinyl.genre}</h2>
              <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible scrollbar-hide">
                {relatedVinyls.map((relatedVinyl) => (
                  <div key={relatedVinyl.id} className="min-w-[160px] sm:min-w-0">
                    <VinylCard vinyl={relatedVinyl} compact className="w-[160px] sm:w-full" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
