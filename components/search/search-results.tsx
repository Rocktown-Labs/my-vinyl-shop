"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSearch } from "@/lib/hooks/use-search";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Music, User } from "lucide-react";
import type { SearchResult } from "@/lib/hooks/use-search";

function SearchResultCard({ result }: { result: SearchResult }) {
  // Use username for seller links if available, otherwise use ID
  const sellerLink = result.type === "seller" && result.metadata?.username
    ? `/seller/${result.metadata.username}`
    : result.type === "seller"
    ? `/seller/${result.id}`
    : `/product/${result.id}`;

  return (
    <Link href={sellerLink}>
      <Card className="w-[200px] shrink-0 hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative aspect-square bg-muted">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {result.type === "vinyl" ? (
                <Music className="h-12 w-12 text-muted-foreground" />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="absolute top-2 right-2">
            {result.type === "vinyl" ? (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                Vinyl
              </span>
            ) : (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                Seller
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-sm truncate">{result.title}</h3>
          <p className="text-xs text-muted-foreground truncate mt-1">{result.subtitle}</p>
          {result.metadata?.price && (
            <p className="text-sm font-semibold mt-2">${result.metadata.price.toFixed(2)}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function SearchResults({ query }: { query: string }) {
  const { data: results, isLoading } = useSearch(query);

  if (isLoading) {
    return (
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="w-[200px] shrink-0">
              <Skeleton className="aspect-square" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No results found for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4">
        {results.map((result) => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
