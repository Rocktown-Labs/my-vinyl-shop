"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { PlusCircle, Pencil, Trash2, MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useVinyls } from "@/lib/hooks/use-vinyls"
import type { ColumnDef } from "@tanstack/react-table"
import type { Vinyl } from "@/lib/db/schema"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const columns: ColumnDef<Vinyl>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Album
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vinyl = row.original
      const images = vinyl.images ? JSON.parse(vinyl.images) : []
      const coverImage = images[0]?.url || "/placeholder.svg"
      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image
              src={coverImage}
              alt={vinyl.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-medium text-sm line-clamp-1">{vinyl.title}</span>
            <p className="text-xs text-muted-foreground">{vinyl.artist}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => <span className="text-sm">{row.getValue("year")}</span>,
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize text-xs">
        {row.getValue("condition")}
      </Badge>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => <span className="text-sm">{row.original.quantity || 1}</span>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number | null
      if (!price) return <span className="text-sm text-muted-foreground">—</span>
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="font-semibold text-sm">{formatted}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vinyl = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/listings/${vinyl.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/product/${vinyl.id}`}>View listing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function MobileListingCard({ vinyl }: { vinyl: Vinyl }) {
  const images = vinyl.images ? JSON.parse(vinyl.images) : []
  const coverImage = images[0]?.url || "/placeholder.svg"
  
  return (
    <div className="flex-shrink-0 w-[160px] rounded-xl bg-card border shadow-sm overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={coverImage}
          alt={vinyl.title}
          fill
          className="object-cover"
        />
        {vinyl.quantity && vinyl.quantity > 1 && (
          <Badge className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-primary/90">x{vinyl.quantity}</Badge>
        )}
        <Badge
          className={`absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 capitalize ${
            vinyl.condition === "sealed"
              ? "bg-green-500/90"
              : vinyl.condition === "mint"
                ? "bg-blue-500/90"
                : "bg-amber-500/90"
          }`}
        >
          {vinyl.condition}
        </Badge>
      </div>
      <div className="p-3 space-y-1">
        <p className="font-medium text-xs truncate">{vinyl.title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{vinyl.artist}</p>
        <div className="flex items-center justify-between pt-1">
          {vinyl.price ? (
            <span className="text-sm font-bold">${vinyl.price.toFixed(2)}</span>
          ) : (
            <span className="text-xs text-muted-foreground">No price</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/listings/${vinyl.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  const { data: listings, isLoading } = useVinyls("listings")

  const newListings = listings?.filter((v) => v.condition === "sealed" || v.condition === "mint") || []
  const usedListings = listings?.filter((v) => v.condition !== "sealed" && v.condition !== "mint") || []

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="border-0 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Listings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your vinyl records ({listings?.length || 0} total)
          </p>
        </div>
        <Button asChild className="rounded-full text-xs sm:text-sm">
          <Link href="/dashboard/listings/new">
            <PlusCircle className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Listing</span>
            <span className="sm:hidden">New</span>
          </Link>
        </Button>
      </div>

      {listings && listings.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No listings yet</p>
            <Button asChild>
              <Link href="/dashboard/listings/new">Create your first listing</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-6 sm:hidden">
            {/* New Listings Section */}
            {newListings.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    New & Sealed
                  </h2>
                  <span className="text-xs text-muted-foreground">{newListings.length} items</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {newListings.map((vinyl) => (
                    <MobileListingCard key={vinyl.id} vinyl={vinyl} />
                  ))}
                </div>
              </div>
            )}

            {/* Used Listings Section */}
            {usedListings.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Used
                  </h2>
                  <span className="text-xs text-muted-foreground">{usedListings.length} items</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  {usedListings.map((vinyl) => (
                    <MobileListingCard key={vinyl.id} vinyl={vinyl} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop/Tablet Data Table */}
          <Card className="border-0 shadow-sm hidden sm:block">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">All Listings ({listings?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {listings && listings.length > 0 ? (
                <DataTable columns={columns} data={listings} searchKey="title" searchPlaceholder="Search listings..." />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No listings found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
