import { NextResponse, type NextRequest } from "next/server";
import { db, users, vinyls } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

// GET - Get seller profile with listings (supports both ID and username)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Try to find by ID first, then by username
    let seller = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.isSeller, true)),
    });

    // If not found by ID, try username
    if (!seller) {
      seller = await db.query.users.findFirst({
        where: and(eq(users.username, id), eq(users.isSeller, true)),
      });
    }

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Get seller's listings
    const listings = await db
      .select()
      .from(vinyls)
      .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isListed, true)))
      .orderBy(desc(vinyls.createdAt));

    // Get seller's collection (public items only)
    const collection = await db
      .select()
      .from(vinyls)
      .where(and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true)))
      .orderBy(desc(vinyls.createdAt));

    return NextResponse.json({
      seller: {
        ...seller,
        specializedGenres: seller.specializedGenres
          ? JSON.parse(seller.specializedGenres)
          : [],
      },
      listings,
      collection,
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller" },
      { status: 500 }
    );
  }
}
