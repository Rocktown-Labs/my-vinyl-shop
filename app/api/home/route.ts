import { NextResponse } from "next/server";
import { db, vinyls, users, orders } from "@/lib/db";
import { eq, and, desc, count, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Get homepage data (featured vinyls, new arrivals, top sellers, stats)
export async function GET() {
  try {
    // Get featured vinyls (recently listed, ordered by creation date)
    const featuredVinyls = await db
      .select({
        id: vinyls.id,
        title: vinyls.title,
        artist: vinyls.artist,
        genre: vinyls.genre,
        year: vinyls.year,
        price: vinyls.price,
        condition: vinyls.condition,
        images: vinyls.images,
        userId: vinyls.userId,
        createdAt: vinyls.createdAt,
      })
      .from(vinyls)
      .where(eq(vinyls.isListed, true))
      .orderBy(desc(vinyls.createdAt))
      .limit(8);

    // Get new arrivals (most recent listings)
    const newArrivals = await db
      .select({
        id: vinyls.id,
        title: vinyls.title,
        artist: vinyls.artist,
        genre: vinyls.genre,
        year: vinyls.year,
        price: vinyls.price,
        condition: vinyls.condition,
        images: vinyls.images,
        userId: vinyls.userId,
        createdAt: vinyls.createdAt,
      })
      .from(vinyls)
      .where(eq(vinyls.isListed, true))
      .orderBy(desc(vinyls.createdAt))
      .limit(10);

    // Get top sellers (sellers with most completed orders, limit 6)
    // First get all sellers, then enrich with sales counts
    const allSellers = await db
      .select()
      .from(users)
      .where(and(eq(users.isSeller, true), eq(users.onboardingCompleted, true)))
      .limit(50); // Get more to sort by sales

    // Get sales counts for each seller
    const sellersWithSales = await Promise.all(
      allSellers.map(async (seller) => {
        const salesCount = await db
          .select({ count: count() })
          .from(orders)
          .where(
            and(eq(orders.sellerId, seller.id), eq(orders.status, "delivered"))
          );
        return {
          ...seller,
          salesCount: salesCount[0]?.count || 0,
        };
      })
    );

    // Sort by sales count and take top 6
    const topSellers = sellersWithSales
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 6)
      .map(({ salesCount, ...seller }) => seller);

    // Get stats
    const totalListings = await db
      .select({ count: count() })
      .from(vinyls)
      .where(eq(vinyls.isListed, true));

    const totalSellers = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(eq(users.isSeller, true), eq(users.onboardingCompleted, true))
      );

    const totalOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, "delivered"));

    // Get genre counts (for shop by genre section)
    const genreCounts = await db
      .select({
        genre: vinyls.genre,
        count: count(),
      })
      .from(vinyls)
      .where(eq(vinyls.isListed, true))
      .groupBy(vinyls.genre)
      .orderBy(desc(count()))
      .limit(6);

    return NextResponse.json({
      featuredVinyls: featuredVinyls.map((vinyl) => ({
        ...vinyl,
        images: vinyl.images ? JSON.parse(vinyl.images) : [],
      })),
      newArrivals: newArrivals.map((vinyl) => ({
        ...vinyl,
        images: vinyl.images ? JSON.parse(vinyl.images) : [],
      })),
      topSellers: topSellers.map((seller) => ({
        ...seller,
        specializedGenres: seller.specializedGenres
          ? JSON.parse(seller.specializedGenres)
          : [],
      })),
      stats: {
        totalListings: totalListings[0]?.count || 0,
        totalSellers: totalSellers[0]?.count || 0,
        totalOrders: totalOrders[0]?.count || 0,
        satisfactionRate: "98%", // Placeholder for now
        countries: "45+", // Placeholder for now
      },
      genres: genreCounts.map((g) => ({
        name: g.genre,
        count: g.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage data" },
      { status: 500 }
    );
  }
}
