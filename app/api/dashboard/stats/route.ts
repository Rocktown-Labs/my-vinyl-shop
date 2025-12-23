import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, vinyls, orders } from "@/lib/db";
import { eq, and, sum, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's listings
    const userListings = await db
      .select()
      .from(vinyls)
      .where(and(eq(vinyls.userId, userId), eq(vinyls.isListed, true)));

    // Get total revenue from completed orders
    const revenueResult = await db
      .select({
        total: sum(orders.totalAmount),
      })
      .from(orders)
      .where(and(eq(orders.sellerId, userId), eq(orders.status, "delivered")));

    const totalRevenue = Number(revenueResult[0]?.total || 0);

    // Get order counts
    const allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.sellerId, userId));

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    ).length;

    // Calculate conversion rate (orders / views, simplified)
    const conversionRate =
      userListings.length > 0 ? (totalOrders / userListings.length) * 100 : 0;

    // Get recent listings (last 5)
    const recentListings = userListings
      .sort((a, b) => {
        const dateA =
          a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB =
          b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((vinyl) => {
        const images = vinyl.images ? JSON.parse(vinyl.images) : [];
        return {
          id: vinyl.id,
          title: vinyl.title,
          artist: vinyl.artist,
          condition: vinyl.condition,
          price: vinyl.price,
          image: images[0]?.url || null,
        };
      });

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalListings: userListings.length,
        totalOrders,
        pendingOrders,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
      recentListings,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
