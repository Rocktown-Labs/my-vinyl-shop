import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SellersListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-sm">
          <Skeleton className="aspect-[3/4] w-full" />
        </Card>
      ))}
    </div>
  )
}
