"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVinyls, useListVinyl, useDeleteVinyl } from "@/lib/hooks/use-vinyls";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Tag, Trash2, MoreHorizontal, Grid3X3, List } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import type { Vinyl } from "@/lib/db/schema";

interface CollectionGridProps {
  viewMode: "grid" | "list";
}

export function CollectionGrid({ viewMode }: CollectionGridProps) {
  const { data: collection, isLoading } = useVinyls("collection");
  const listVinyl = useListVinyl();
  const deleteVinyl = useDeleteVinyl();

  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [selectedVinyl, setSelectedVinyl] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState("");

  const handleListVinyl = async () => {
    if (!selectedVinyl || !listPrice) return;

    await listVinyl.mutateAsync({
      id: selectedVinyl,
      price: Number.parseFloat(listPrice),
    });

    setListDialogOpen(false);
    setSelectedVinyl(null);
    setListPrice("");
  };

  const handleDeleteVinyl = async (id: string) => {
    if (confirm("Are you sure you want to remove this from your collection?")) {
      await deleteVinyl.mutateAsync(id);
    }
  };

  const openListDialog = (id: string) => {
    setSelectedVinyl(id);
    setListDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
            <Grid3X3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No records yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your collection by adding your first vinyl record.
          </p>
          <Button asChild>
            <Link href="/dashboard/collection/add">
              Add Your First Record
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collection.map((vinyl) => {
            const images = vinyl.images ? JSON.parse(vinyl.images) : [];
            const coverImage = images[0]?.url || "/placeholder.svg?height=300&width=300";

            return (
              <Card key={vinyl.id} className="overflow-hidden group">
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={coverImage || "/placeholder.svg"}
                    alt={vinyl.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openListDialog(vinyl.id)}>
                      <Tag className="h-4 w-4 mr-1" />
                      List
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 text-xs">{vinyl.condition}</Badge>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{vinyl.title}</h3>
                      <p className="text-xs text-muted-foreground truncate">{vinyl.artist}</p>
                      {vinyl.year && <p className="text-xs text-muted-foreground">{vinyl.year}</p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openListDialog(vinyl.id)}>
                          <Tag className="h-4 w-4 mr-2" />
                          List for Sale
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteVinyl(vinyl.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>List for Sale</DialogTitle>
              <DialogDescription>
                Set a price to list this record on the marketplace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setListDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleListVinyl} disabled={!listPrice || listVinyl.isPending}>
                {listVinyl.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Listing...
                  </>
                ) : (
                  "List for Sale"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // List view
  return (
    <>
      <div className="space-y-2">
        {collection.map((vinyl) => {
          const images = vinyl.images ? JSON.parse(vinyl.images) : [];
          const coverImage = images[0]?.url || "/placeholder.svg?height=80&width=80";

          return (
            <Card key={vinyl.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={coverImage || "/placeholder.svg"}
                    alt={vinyl.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{vinyl.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{vinyl.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {vinyl.condition}
                    </Badge>
                    {vinyl.year && <span className="text-xs text-muted-foreground">{vinyl.year}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => openListDialog(vinyl.id)}>
                    <Tag className="h-4 w-4 mr-1" />
                    List
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteVinyl(vinyl.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List for Sale</DialogTitle>
            <DialogDescription>Set a price to list this record on the marketplace.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleListVinyl} disabled={!listPrice || listVinyl.isPending}>
              {listVinyl.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Listing...
                </>
              ) : (
                "List for Sale"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
