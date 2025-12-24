import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, vinyls, orders, follows, messages, conversations } from "@/lib/db";
import { eq, and, or, sum, count, sql, gte, desc, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // ===== SALES METRICS =====
    // Total revenue (all time)
    const totalRevenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(and(eq(orders.sellerId, userId), eq(orders.status, "delivered")));
    const totalRevenue = Number(totalRevenueResult[0]?.total || 0);

    // Revenue this week
    const weekRevenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, userId),
          eq(orders.status, "delivered"),
          gte(orders.createdAt, thisWeek)
        )
      );
    const weekRevenue = Number(weekRevenueResult[0]?.total || 0);

    // Revenue this month
    const monthRevenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, userId),
          eq(orders.status, "delivered"),
          gte(orders.createdAt, thisMonth)
        )
      );
    const monthRevenue = Number(monthRevenueResult[0]?.total || 0);

    // Revenue this year
    const yearRevenueResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, userId),
          eq(orders.status, "delivered"),
          gte(orders.createdAt, thisYear)
        )
      );
    const yearRevenue = Number(yearRevenueResult[0]?.total || 0);

    // Average order value
    const allDeliveredOrders = await db
      .select()
      .from(orders)
      .where(and(eq(orders.sellerId, userId), eq(orders.status, "delivered")));
    const averageOrderValue =
      allDeliveredOrders.length > 0
        ? allDeliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) /
          allDeliveredOrders.length
        : 0;

    // ===== ORDER METRICS =====
    const allOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.sellerId, userId));

    const ordersByStatus = {
      pending: allOrders.filter((o) => o.status === "pending").length,
      paid: allOrders.filter((o) => o.status === "paid").length,
      shipped: allOrders.filter((o) => o.status === "shipped").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    };

    const totalOrders = allOrders.length;
    const completedOrders = ordersByStatus.delivered;
    const orderCompletionRate =
      totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Orders this week/month/year
    const weekOrders = allOrders.filter((o) => {
      if (!o.createdAt) return false;
      const orderDate =
        o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
      return orderDate >= thisWeek;
    }).length;
    const monthOrders = allOrders.filter((o) => {
      if (!o.createdAt) return false;
      const orderDate =
        o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
      return orderDate >= thisMonth;
    }).length;
    const yearOrders = allOrders.filter((o) => {
      if (!o.createdAt) return false;
      const orderDate =
        o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
      return orderDate >= thisYear;
    }).length;

    // ===== LISTING METRICS =====
    const allListings = await db
      .select()
      .from(vinyls)
      .where(and(eq(vinyls.userId, userId), eq(vinyls.isListed, true)));

    const activeListings = allListings.length;
    const totalListingsEver = await db
      .select({ count: count() })
      .from(vinyls)
      .where(eq(vinyls.userId, userId));
    const totalListingsCount = totalListingsEver[0]?.count || 0;

    // Best selling genres
    const genreSales = await db
      .select({
        genre: vinyls.genre,
        count: count(),
        revenue: sum(orders.totalAmount),
      })
      .from(orders)
      .innerJoin(vinyls, eq(orders.vinylId, vinyls.id))
      .where(and(eq(orders.sellerId, userId), eq(orders.status, "delivered")))
      .groupBy(vinyls.genre)
      .orderBy(desc(count()))
      .limit(5);

    // Average listing price
    const listingsWithPrice = allListings.filter((l) => l.price && l.price > 0);
    const averageListingPrice =
      listingsWithPrice.length > 0
        ? listingsWithPrice.reduce((sum, l) => sum + (l.price || 0), 0) /
          listingsWithPrice.length
        : 0;

    // ===== ENGAGEMENT METRICS =====
    // Followers count
    const followersCount = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, userId));
    const totalFollowers = followersCount[0]?.count || 0;

    // Messages received (messages in conversations where user is a participant but not the sender)
    const userConversations = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )!
      );
    const conversationIds = userConversations.map((c) => c.id);

    let messagesCount = 0;
    if (conversationIds.length > 0) {
      // For each conversation, count messages where sender is not the user
      const messageCounts = await Promise.all(
        conversationIds.map(async (convId) => {
          const result = await db
            .select({ count: count() })
            .from(messages)
            .where(
              and(
                eq(messages.conversationId, convId),
                ne(messages.senderId, userId)
              )
            );
          return result[0]?.count || 0;
        })
      );
      messagesCount = messageCounts.reduce((sum, cnt) => sum + cnt, 0);
    }

    // ===== COLLECTION METRICS =====
    const collectionItems = await db
      .select({ count: count() })
      .from(vinyls)
      .where(and(eq(vinyls.userId, userId), eq(vinyls.isInCollection, true)));
    const totalCollectionItems = collectionItems[0]?.count || 0;

    // Items converted from collection to listings
    const convertedItems = await db
      .select({ count: count() })
      .from(vinyls)
      .where(
        and(
          eq(vinyls.userId, userId),
          eq(vinyls.isInCollection, true),
          eq(vinyls.isListed, true)
        )
      );
    const totalConverted = convertedItems[0]?.count || 0;

    // ===== RECENT ACTIVITY =====
    // Recent orders (last 10)
    const recentOrders = allOrders
      .filter((o) => o.createdAt != null)
      .sort((a, b) => {
        const dateA =
          a.createdAt instanceof Date
            ? a.createdAt
            : a.createdAt
              ? new Date(a.createdAt)
              : new Date(0);
        const dateB =
          b.createdAt instanceof Date
            ? b.createdAt
            : b.createdAt
              ? new Date(b.createdAt)
              : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10)
      .map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount || 0,
        createdAt: order.createdAt || new Date(),
      }));

    // Top selling items
    const topSellingItems = await db
      .select({
        vinylId: orders.vinylId,
        title: vinyls.title,
        artist: vinyls.artist,
        quantity: sql<number>`SUM(${orders.quantity})`.as("total_quantity"),
        revenue: sum(orders.totalAmount),
      })
      .from(orders)
      .innerJoin(vinyls, eq(orders.vinylId, vinyls.id))
      .where(and(eq(orders.sellerId, userId), eq(orders.status, "delivered")))
      .groupBy(orders.vinylId, vinyls.title, vinyls.artist)
      .orderBy(desc(sql`SUM(${orders.quantity})`))
      .limit(5);

    return NextResponse.json({
      sales: {
        totalRevenue,
        weekRevenue,
        monthRevenue,
        yearRevenue,
        averageOrderValue,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus,
        completionRate: Math.round(orderCompletionRate * 10) / 10,
        week: weekOrders,
        month: monthOrders,
        year: yearOrders,
      },
      listings: {
        active: activeListings,
        total: totalListingsCount,
        averagePrice: Math.round(averageListingPrice * 100) / 100,
        bestSellingGenres: genreSales.map((g) => ({
          genre: g.genre,
          sales: g.count || 0,
          revenue: Number(g.revenue || 0),
        })),
      },
      engagement: {
        followers: totalFollowers,
        messagesReceived: messagesCount,
      },
      collection: {
        totalItems: totalCollectionItems,
        convertedToListings: totalConverted,
      },
      recentOrders: recentOrders.slice(0, 5).map((o) => ({
        id: o.id,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt:
          o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      })),
      topSellingItems: topSellingItems.map((item) => ({
        vinylId: item.vinylId,
        title: item.title,
        artist: item.artist,
        quantitySold: Number(item.quantity || 0),
        revenue: Number(item.revenue || 0),
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
