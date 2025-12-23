import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { db, orders, vinyls, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify user is buyer or seller
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Enrich with related data
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

    return NextResponse.json({
      order: {
        ...order,
        vinyl: vinyl
          ? {
              id: vinyl.id,
              title: vinyl.title,
              artist: vinyl.artist,
              description: vinyl.description,
              price: vinyl.price,
              condition: vinyl.condition,
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
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
