import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, users, vinyls } from "@/lib/db";
import { eq, and, desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Get seller's collection (paginated, respects privacy)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "8");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Try to find by ID first, then by username
    let seller = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.isSeller, true)),
    });

    if (!seller) {
      seller = await db.query.users.findFirst({
        where: and(eq(users.username, id), eq(users.isSeller, true)),
      });
    }

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Check privacy settings
    const { userId: currentUserId } = await auth();
    const isOwner = currentUserId === seller.id;
    const isCollectionPublic =
      seller.collectionPrivacy === "public" || !seller.collectionPrivacy;

    if (!isOwner && !isCollectionPublic) {
      return NextResponse.json(
        { error: "Collection is private" },
        { status: 403 }
      );
    }

    // Get collection items
    const collection = await db
      .select()
      .from(vinyls)
      .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true)))
      .orderBy(desc(vinyls.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: count() })
      .from(vinyls)
      .where(
        and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true))
      );

    return NextResponse.json({
      collection: collection.map((vinyl) => ({
        ...vinyl,
        images: vinyl.images ? JSON.parse(vinyl.images) : [],
      })),
      pagination: {
        total: totalCount[0]?.count || 0,
        limit,
        offset,
        hasMore: (totalCount[0]?.count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}
