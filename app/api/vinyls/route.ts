import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { db, vinyls } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { canUserListItems } from "@/lib/stripe-connect";

// GET - List user's vinyls (collection and/or listings)
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'collection', 'listings', 'all'
  const limit = Number.parseInt(searchParams.get("limit") || "50");
  const offset = Number.parseInt(searchParams.get("offset") || "0");

  try {
    let whereClause = eq(vinyls.userId, userId);

    if (type === "collection") {
      whereClause = and(
        eq(vinyls.userId, userId),
        eq(vinyls.isInCollection, true),
        eq(vinyls.isListed, false)
      )!;
    } else if (type === "listings") {
      whereClause = and(eq(vinyls.userId, userId), eq(vinyls.isListed, true))!;
    }

    const results = await db
      .select()
      .from(vinyls)
      .where(whereClause)
      .orderBy(desc(vinyls.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ vinyls: results });
  } catch (error) {
    console.error("Error fetching vinyls:", error);
    return NextResponse.json(
      { error: "Failed to fetch vinyls" },
      { status: 500 }
    );
  }
}

// POST - Create a new vinyl
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      artist,
      genre,
      year,
      label,
      catalogNumber,
      description,
      condition,
      sleeveCondition,
      vinylCondition,
      type,
      images,
      isListed,
      isInCollection,
      price,
      listingType,
      startingBid,
      reservePrice,
      buyNowPrice,
      auctionEndDate,
      quantity,
      aiSuggestedPrice,
      aiConditionNotes,
    } = body;

    // Check if user can create listings (Stripe Connect validation)
    if (isListed) {
      const listingCheck = await canUserListItems(userId);
      if (!listingCheck.canList) {
        return NextResponse.json(
          {
            error: listingCheck.reason || "Cannot create listing",
            requiresStripeConnect: true,
            stripeAccountId: listingCheck.accountId,
            stripeStatus: listingCheck.status,
          },
          { status: 403 }
        );
      }
    }

    const [newVinyl] = await db
      .insert(vinyls)
      .values({
        userId,
        title,
        artist,
        genre,
        year,
        label,
        catalogNumber,
        description,
        condition,
        sleeveCondition,
        vinylCondition,
        type: type || "used",
        images: images ? JSON.stringify(images) : null,
        isListed: isListed ?? false,
        isInCollection: isInCollection ?? true,
        price,
        listingType,
        startingBid,
        reservePrice,
        buyNowPrice,
        auctionEndDate: auctionEndDate ? new Date(auctionEndDate) : null,
        quantity: quantity || 1,
        aiSuggestedPrice,
        aiConditionNotes,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ vinyl: newVinyl });
  } catch (error) {
    console.error("Error creating vinyl:", error);
    return NextResponse.json(
      { error: "Failed to create vinyl" },
      { status: 500 }
    );
  }
}
