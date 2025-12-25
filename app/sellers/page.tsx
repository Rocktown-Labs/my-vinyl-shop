import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { db, users, vinyls, orders } from "@/lib/db"
import { eq, desc, and, count } from "drizzle-orm"
import { Suspense } from "react"
import { SellersFilters } from "@/components/sellers/sellers-filters"
import { SellersListSkeleton } from "@/components/sellers/sellers-list-skeleton"

async function getInitialSellers() {
  try {
    const sellers = await db
      .select()
      .from(users)
      .where(and(eq(users.isSeller, true), eq(users.onboardingCompleted, true)))
      .orderBy(desc(users.createdAt))
      .limit(50)

    // Enrich sellers with stats
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        // Get listings count
        const listingsCount = await db
          .select({ count: count() })
          .from(vinyls)
          .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isListed, true)))

        // Get collection count
        const collectionCount = await db
          .select({ count: count() })
          .from(vinyls)
          .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true)))

        // Get completed orders count
        const ordersCount = await db
          .select({ count: count() })
          .from(orders)
          .where(and(eq(orders.sellerId, seller.id), eq(orders.status, "delivered")))

        return {
          ...seller,
          stats: {
            listings: listingsCount[0]?.count || 0,
            collection: collectionCount[0]?.count || 0,
            sales: ordersCount[0]?.count || 0,
          },
        }
      })
    )

    return sellersWithStats
  } catch (error) {
    console.error("Error fetching initial sellers:", error)
    return []
  }
}

export default async function SellersPage() {
  const initialSellers = await getInitialSellers()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="bg-muted/30 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Discover Sellers</h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Find verified sellers from around the world with exceptional collections
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Suspense fallback={<SellersListSkeleton />}>
            <SellersFilters initialSellers={initialSellers} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
