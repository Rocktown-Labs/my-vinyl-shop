"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Share2, Tag, Package, Bell, Megaphone } from "lucide-react"
import Link from "next/link"
import { mockFeedPosts, mockSellers, mockVinyls } from "@/lib/mock-data"
import { motion } from "motion/react"
import { formatDistanceToNow } from "date-fns"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"

export default function FeedPage() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case "new_listing":
        return <Package className="h-4 w-4" />
      case "price_drop":
        return <Tag className="h-4 w-4" />
      case "restock":
        return <Bell className="h-4 w-4" />
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPostLabel = (type: string) => {
    switch (type) {
      case "new_listing":
        return "New Listing"
      case "price_drop":
        return "Price Drop"
      case "restock":
        return "Restock"
      case "announcement":
        return "Announcement"
      default:
        return type
    }
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Updates from sellers you follow</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 sm:mb-6 h-9 sm:h-10">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="listings" className="text-xs sm:text-sm">
            New Listings
          </TabsTrigger>
          <TabsTrigger value="deals" className="text-xs sm:text-sm">
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockFeedPosts.map((post, index) => {
            const seller = mockSellers.find((s) => s.id === post.sellerId)
            const vinyl = post.vinylId ? mockVinyls.find((v) => v.id === post.vinylId) : null

            if (!seller) return null

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <Link href={`/seller/${seller.id}`}>
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                          <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/seller/${seller.id}`}
                            className="font-semibold text-sm sm:text-base hover:underline"
                          >
                            {seller.name}
                          </Link>
                          <Badge variant="secondary" className="text-[10px] sm:text-xs">
                            {getPostIcon(post.type)}
                            <span className="ml-1">{getPostLabel(post.type)}</span>
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm sm:text-base mb-4">{post.content}</p>

                    {/* Vinyl Preview */}
                    {vinyl && (
                      <Link href={`/product/${vinyl.id}`}>
                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-xl mb-4 hover:bg-muted transition-colors">
                          <img
                            src={vinyl.images.frontCover || "/placeholder.svg"}
                            alt={vinyl.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{vinyl.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{vinyl.artist}</p>
                            <p className="text-base sm:text-lg font-bold mt-1">${vinyl.price}</p>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full ${likedPosts.has(post.id) ? "text-red-500" : ""}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                        <span className="text-xs sm:text-sm">{likedPosts.has(post.id) ? "24" : "23"}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs sm:text-sm">5</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          {mockFeedPosts
            .filter((p) => p.type === "new_listing")
            .map((post, index) => {
              const seller = mockSellers.find((s) => s.id === post.sellerId)
              const vinyl = post.vinylId ? mockVinyls.find((v) => v.id === post.vinylId) : null

              if (!seller) return null

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                          <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{seller.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-4">{post.content}</p>
                      {vinyl && (
                        <Link href={`/product/${vinyl.id}`}>
                          <div className="flex gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                            <img
                              src={vinyl.images.frontCover || "/placeholder.svg"}
                              alt={vinyl.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-sm">{vinyl.title}</h4>
                              <p className="text-xs text-muted-foreground">{vinyl.artist}</p>
                              <p className="text-lg font-bold mt-1">${vinyl.price}</p>
                            </div>
                          </div>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          {mockFeedPosts
            .filter((p) => p.type === "price_drop" || p.type === "restock")
            .map((post, index) => {
              const seller = mockSellers.find((s) => s.id === post.sellerId)
              const vinyl = post.vinylId ? mockVinyls.find((v) => v.id === post.vinylId) : null

              if (!seller) return null

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
                          <AvatarFallback>{seller.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{seller.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-4">{post.content}</p>
                      {vinyl && (
                        <Link href={`/product/${vinyl.id}`}>
                          <div className="flex gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                            <img
                              src={vinyl.images.frontCover || "/placeholder.svg"}
                              alt={vinyl.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-sm">{vinyl.title}</h4>
                              <p className="text-xs text-muted-foreground">{vinyl.artist}</p>
                              <p className="text-lg font-bold mt-1">${vinyl.price}</p>
                            </div>
                          </div>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
        </TabsContent>
      </Tabs>

      <DashboardBottomNav />
    </div>
  )
}
