"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Star,
  Package,
  Grid3x3,
  LayoutList,
  CheckCircle2,
  Calendar,
  Share2,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { mockSellers, mockVinyls } from "@/lib/mock-data"
import { VinylCard } from "@/components/vinyl-card"
import { motion } from "motion/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SellerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const seller = mockSellers.find((s) => s.id === id)
  const sellerVinyls = mockVinyls.filter((v) => v.sellerId === id)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [isFollowing, setIsFollowing] = useState(false)

  if (!seller) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center px-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Seller not found</h1>
            <Button asChild className="rounded-full">
              <Link href="/sellers">Browse Sellers</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        {/* Profile Header - Instagram Style */}
        <div className="border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-16 items-center sm:items-start">
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="shrink-0"
              >
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 border-4 border-background shadow-xl">
                  <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                  <AvatarFallback className="text-2xl sm:text-4xl font-semibold bg-accent text-accent-foreground">
                    {seller.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Info */}
              <div className="flex-1 space-y-4 sm:space-y-6 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{seller.name}</h1>
                      {seller.verified && <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent fill-accent/20" />}
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground">{seller.username}</p>
                  </div>
                  <div className="flex gap-2 sm:ml-auto">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className="rounded-full px-5 sm:px-6 h-9 sm:h-10 text-sm"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-transparent h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-transparent h-9 w-9 sm:h-10 sm:w-10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Block</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center sm:justify-start gap-6 sm:gap-8">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">{sellerVinyls.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Listings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">{seller.totalSales}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-accent fill-accent" />
                      {seller.rating}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm sm:text-base leading-relaxed max-w-2xl">{seller.bio}</p>

                {/* Meta */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>
                      Joined{" "}
                      {new Date(seller.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-border/40 pb-4 gap-4">
              <TabsList className="bg-transparent p-0 h-auto gap-4 sm:gap-6 overflow-x-auto">
                <TabsTrigger
                  value="active"
                  className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 pt-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground font-medium text-xs sm:text-sm whitespace-nowrap"
                >
                  <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Active
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
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {sellerVinyls.map((vinyl, index) => (
                    <motion.div
                      key={vinyl.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <VinylCard vinyl={vinyl} />
                    </motion.div>
                  ))}
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
                      {sellerVinyls.map((vinyl) => (
                        <TableRow key={vinyl.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-4">
                              <img
                                src={vinyl.images.frontCover || "/placeholder.svg"}
                                alt={vinyl.title}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <span className="line-clamp-1 font-medium">{vinyl.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{vinyl.artist}</TableCell>
                          <TableCell className="text-muted-foreground">{vinyl.year}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize font-normal">
                              {vinyl.condition}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">${vinyl.price}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="rounded-full bg-transparent" asChild>
                              <Link href={`/product/${vinyl.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
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
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">About {seller.name}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{seller.bio}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">Member Since</p>
                      <p className="text-sm sm:text-base font-medium">
                        {new Date(seller.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">Location</p>
                      <p className="text-sm sm:text-base font-medium">{seller.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-sm sm:text-base font-medium">{seller.totalSales} items</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">Rating</p>
                      <p className="text-sm sm:text-base font-medium flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent fill-accent" />
                        {seller.rating} / 5
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
