import { NextResponse, type NextRequest } from "next/server";
import { db, users, vinyls, orders } from "@/lib/db";
import { eq, desc, and, count, sql } from "drizzle-orm";

// GET - List all sellers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const country = searchParams.get("country");
  const genre = searchParams.get("genre");
  const verified = searchParams.get("verified");
  const worldwide = searchParams.get("worldwide");
  const limit = Number.parseInt(searchParams.get("limit") || "50");
  const offset = Number.parseInt(searchParams.get("offset") || "0");

  try {
    const query = db
      .select()
      .from(users)
      .where(and(eq(users.isSeller, true), eq(users.onboardingCompleted, true)))
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const sellers = await query;

    // Apply filters in memory for now (can optimize with proper SQL later)
    let filtered = sellers;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.displayName?.toLowerCase().includes(searchLower) ||
          s.username?.toLowerCase().includes(searchLower) ||
          s.bio?.toLowerCase().includes(searchLower)
      );
    }

    if (country) {
      filtered = filtered.filter((s) => s.country === country);
    }

    if (genre) {
      filtered = filtered.filter((s) => {
        const genres = s.specializedGenres
          ? JSON.parse(s.specializedGenres)
          : [];
        return genres.includes(genre);
      });
    }

    if (verified === "true") {
      filtered = filtered.filter((s) => s.isVerified);
    }

    if (worldwide === "true") {
      filtered = filtered.filter((s) => s.shipsWorldwide);
    }

    // Enrich sellers with stats
    const sellersWithStats = await Promise.all(
      filtered.map(async (seller) => {
        // Get listings count
        const listingsCount = await db
          .select({ count: count() })
          .from(vinyls)
          .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isListed, true)));

        // Get collection count
        const collectionCount = await db
          .select({ count: count() })
          .from(vinyls)
          .where(
            and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true))
          );

        // Get completed orders count (as a proxy for sales/rating)
        const ordersCount = await db
          .select({ count: count() })
          .from(orders)
          .where(
            and(eq(orders.sellerId, seller.id), eq(orders.status, "delivered"))
          );

        return {
          ...seller,
          stats: {
            listings: listingsCount[0]?.count || 0,
            collection: collectionCount[0]?.count || 0,
            sales: ordersCount[0]?.count || 0,
          },
        };
      })
    );

    return NextResponse.json({ sellers: sellersWithStats });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}
