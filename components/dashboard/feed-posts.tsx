"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Tag, Package, Bell, Megaphone } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export interface FeedPost {
  id: string;
  sellerId: string;
  type: "new_listing" | "price_drop" | "restock" | "announcement";
  vinylId?: string;
  content: string;
  createdAt: string;
  seller?: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
  vinyl?: {
    id: string;
    title: string;
    artist: string;
    price?: number;
    image?: string;
  };
}

function FeedPostCard({ post }: { post: FeedPost }) {
  const getPostIcon = (type: string) => {
    switch (type) {
      case "new_listing":
        return <Package className="h-4 w-4" />;
      case "price_drop":
        return <Tag className="h-4 w-4" />;
      case "restock":
        return <Bell className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPostLabel = (type: string) => {
    switch (type) {
      case "new_listing":
        return "New Listing";
      case "price_drop":
        return "Price Drop";
      case "restock":
        return "Restock";
      case "announcement":
        return "Announcement";
      default:
        return type;
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/seller/${post.sellerId}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.seller?.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback>
                {post.seller?.displayName?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/seller/${post.sellerId}`}>
                <span className="font-semibold text-sm hover:underline">
                  {post.seller?.displayName || "Unknown"}
                </span>
              </Link>
              <Badge variant="secondary" className="text-xs">
                {getPostIcon(post.type)}
                <span className="ml-1">{getPostLabel(post.type)}</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm mb-4">{post.content}</p>

        {/* Vinyl Preview */}
        {post.vinyl && (
          <Link href={`/product/${post.vinyl.id}`}>
            <Card className="border bg-muted/50 hover:bg-muted transition-colors">
              <CardContent className="p-3 flex items-center gap-3">
                {post.vinyl.image ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={post.vinyl.image}
                      alt={post.vinyl.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{post.vinyl.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{post.vinyl.artist}</p>
                  {post.vinyl.price && (
                    <p className="text-sm font-semibold mt-1">${post.vinyl.price.toFixed(2)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm" className="rounded-full">
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full" asChild>
            <Link href={`/seller/${post.sellerId}`}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeedPosts() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const res = await fetch("/api/feed");
      if (!res.ok) throw new Error("Failed to fetch feed");
      const data = await res.json();
      return data.posts as FeedPost[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No updates yet</h3>
          <p className="text-muted-foreground">
            Follow sellers to see their updates in your feed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
