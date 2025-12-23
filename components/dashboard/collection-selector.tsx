"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVinyls } from "@/lib/hooks/use-vinyls";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Check, Music } from "lucide-react";
import type { Vinyl } from "@/lib/db/schema";

interface CollectionSelectorProps {
  onSelect: (vinyl: Vinyl) => void;
  selectedId?: string;
}

export function CollectionSelector({ onSelect, selectedId }: CollectionSelectorProps) {
  const { data: collection, isLoading } = useVinyls("collection");
  const [selected, setSelected] = useState<string | null>(selectedId || null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!collection || collection.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No records in collection</h3>
          <p className="text-muted-foreground mb-4">
            Add records to your collection first, then you can list them for sale.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {collection.map((vinyl) => {
        const images = vinyl.images ? JSON.parse(vinyl.images) : [];
        const coverImage = images[0]?.url || "/placeholder.svg";
        const isSelected = selected === vinyl.id;

        return (
          <Card
            key={vinyl.id}
            className={`overflow-hidden cursor-pointer transition-all ${
              isSelected ? "ring-2 ring-primary" : "hover:shadow-md"
            }`}
            onClick={() => {
              setSelected(vinyl.id);
              onSelect(vinyl);
            }}
          >
            <div className="aspect-square relative bg-muted">
              <Image
                src={coverImage}
                alt={vinyl.title}
                fill
                className="object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              )}
              <Badge className="absolute top-2 right-2 text-xs">{vinyl.condition}</Badge>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm truncate">{vinyl.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{vinyl.artist}</p>
              {vinyl.year && (
                <p className="text-xs text-muted-foreground">{vinyl.year}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
