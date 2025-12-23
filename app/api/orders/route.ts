import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { db, orders, vinyls, users } from "@/lib/db";
import { eq, and, desc, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - List user's orders (as buyer or seller)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // 'buyer' or 'seller'
    const status = searchParams.get("status"); // filter by status
    const limit = Number.parseInt(searchParams.get("limit") || "50");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    let whereClause;
    if (role === "seller") {
      whereClause = eq(orders.sellerId, userId);
    } else if (role === "buyer") {
      whereClause = eq(orders.buyerId, userId);
    } else {
      // Both buyer and seller orders
      whereClause = or(
        eq(orders.buyerId, userId),
        eq(orders.sellerId, userId)
      )!;
    }

    if (status) {
      whereClause = and(whereClause, eq(orders.status, status))!;
    }

    const results = await db
      .select({
        id: orders.id,
        buyerId: orders.buyerId,
        sellerId: orders.sellerId,
        vinylId: orders.vinylId,
        quantity: orders.quantity,
        totalAmount: orders.totalAmount,
        shippingAmount: orders.shippingAmount,
        status: orders.status,
        shippingAddress: orders.shippingAddress,
        trackingNumber: orders.trackingNumber,
        notes: orders.notes,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    // Enrich with vinyl and user data
    const enrichedOrders = await Promise.all(
      results.map(async (order) => {
        const vinyl = await db.query.vinyls.findFirst({
          where: eq(vinyls.id, order.vinylId),
        });

        const buyer = await db.query.users.findFirst({
          where: eq(users.id, order.buyerId),
          columns: {
            id: true,
            displayName: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        });

        const seller = await db.query.users.findFirst({
          where: eq(users.id, order.sellerId),
          columns: {
            id: true,
            displayName: true,
            username: true,
            email: true,
            avatarUrl: true,
          },
        });

        const images = vinyl?.images ? JSON.parse(vinyl.images) : [];
        const shippingAddress = order.shippingAddress
          ? JSON.parse(order.shippingAddress)
          : null;

        return {
          ...order,
          vinyl: vinyl
            ? {
                id: vinyl.id,
                title: vinyl.title,
                artist: vinyl.artist,
                price: vinyl.price,
                image: images[0]?.url || null,
              }
            : null,
          buyer: buyer
            ? {
                id: buyer.id,
                name: buyer.displayName || "Unknown",
                email: buyer.email || "",
                avatar: buyer.avatarUrl || null,
              }
            : null,
          seller: seller
            ? {
                id: seller.id,
                name: seller.displayName || "Unknown",
                email: seller.email || "",
                avatar: seller.avatarUrl || null,
              }
            : null,
          shippingAddress,
        };
      })
    );

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
