"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VinylForm } from "./forms/vinyl-form";
import { CollectionSelector } from "./collection-selector";
import { Package, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vinyl } from "@/lib/db/schema";

type SourceType = "new" | "collection";

export function ListingFormWrapper() {
  const [sourceType, setSourceType] = useState<SourceType>("new");
  const [selectedCollectionItem, setSelectedCollectionItem] = useState<Vinyl | null>(null);

  if (selectedCollectionItem) {
    // Prefill form with collection item data
    return (
      <VinylForm
        mode="listing"
        initialData={{
          title: selectedCollectionItem.title,
          artist: selectedCollectionItem.artist,
          genre: selectedCollectionItem.genre,
          year: selectedCollectionItem.year || undefined,
          condition: selectedCollectionItem.condition,
          sleeveCondition: selectedCollectionItem.sleeveCondition || undefined,
          description: selectedCollectionItem.description || undefined,
          images: selectedCollectionItem.images || undefined,
          type: selectedCollectionItem.type,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Choose Source</CardTitle>
          <CardDescription>Create a new listing or select from your collection</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                sourceType === "new" ? "ring-2 ring-primary" : "",
              )}
              onClick={() => setSourceType("new")}
            >
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">New Listing</h3>
                <p className="text-sm text-muted-foreground">Create a brand new listing from scratch</p>
              </CardContent>
            </Card>
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                sourceType === "collection" ? "ring-2 ring-primary" : "",
              )}
              onClick={() => setSourceType("collection")}
            >
              <CardContent className="p-6 text-center">
                <Music className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">From Collection</h3>
                <p className="text-sm text-muted-foreground">List a record from your collection</p>
              </CardContent>
            </Card>
          </div>

          {sourceType === "collection" && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Select from Collection</h3>
              <CollectionSelector
                onSelect={(vinyl) => {
                  setSelectedCollectionItem(vinyl);
                }}
              />
            </div>
          )}

          {sourceType === "new" && (
            <div className="mt-6">
              <VinylForm mode="listing" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
