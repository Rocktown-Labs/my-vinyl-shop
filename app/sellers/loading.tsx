import { SellersListSkeleton } from "@/components/sellers/sellers-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filter Bar Skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Skeleton className="h-11 flex-1 rounded-full" />
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
          </div>
          <Skeleton className="md:hidden h-11 w-24 rounded-full" />
        </div>

        {/* Sellers Grid Skeleton */}
        <SellersListSkeleton />
      </div>
    </div>
  )
}
