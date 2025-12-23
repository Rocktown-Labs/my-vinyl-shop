import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, vinyls, users, notifications } from "@/lib/db";
import { eq, and, desc, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Get feed posts (new listings, price drops, etc. from followed sellers)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get users that the current user follows
    // For now, we'll show all sellers' recent listings
    // TODO: Implement follows table query when ready
    const recentListings = await db
      .select({
        id: vinyls.id,
        title: vinyls.title,
        artist: vinyls.artist,
        price: vinyls.price,
        images: vinyls.images,
        userId: vinyls.userId,
        createdAt: vinyls.createdAt,
      })
      .from(vinyls)
      .where(and(eq(vinyls.isListed, true)))
      .orderBy(desc(vinyls.createdAt))
      .limit(20);

    // Enrich with seller and image data
    const posts = await Promise.all(
      recentListings.map(async (vinyl) => {
        const seller = await db.query.users.findFirst({
          where: eq(users.id, vinyl.userId),
          columns: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        });

        const images = vinyl.images ? JSON.parse(vinyl.images) : [];

        return {
          id: `post-${vinyl.id}`,
          sellerId: vinyl.userId,
          type: "new_listing" as const,
          vinylId: vinyl.id,
          content: `Just listed: ${vinyl.title} by ${vinyl.artist}`,
          createdAt:
            vinyl.createdAt instanceof Date
              ? vinyl.createdAt.toISOString()
              : new Date(vinyl.createdAt).toISOString(),
          seller: seller
            ? {
                id: seller.id,
                displayName: seller.displayName || "Unknown",
                username: seller.username || "",
                avatarUrl: seller.avatarUrl || undefined,
              }
            : undefined,
          vinyl: {
            id: vinyl.id,
            title: vinyl.title,
            artist: vinyl.artist,
            price: vinyl.price || undefined,
            image: images[0]?.url || undefined,
          },
        };
      })
    );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
