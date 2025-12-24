import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, users, vinyls, follows } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import {
  getFollowerCount,
  getFollowingCount,
  setFollowerCount,
  setFollowingCount,
  getFollowStatus,
} from "@/lib/redis/follows";
import { count } from "drizzle-orm";

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

    // Get seller's collection (respect privacy settings)
    const { userId: currentUserId } = await auth();
    const isOwner = currentUserId === seller.id;
    const isCollectionPublic =
      seller.collectionPrivacy === "public" || !seller.collectionPrivacy;

    const collectionWhere =
      isOwner || isCollectionPublic
        ? and(eq(vinyls.userId, seller.id), eq(vinyls.isInCollection, true))
        : null; // Don't return collection if private and not owner

    const collection = collectionWhere
      ? await db
          .select()
          .from(vinyls)
          .where(collectionWhere)
          .orderBy(desc(vinyls.createdAt))
      : [];

    // Get follower/following counts (with Redis caching)
    let followerCount = await getFollowerCount(seller.id);
    if (followerCount === null) {
      const result = await db
        .select({ count: count() })
        .from(follows)
        .where(eq(follows.followingId, seller.id));
      followerCount = result[0]?.count || 0;
      await setFollowerCount(seller.id, followerCount);
    }

    let followingCount = await getFollowingCount(seller.id);
    if (followingCount === null) {
      const result = await db
        .select({ count: count() })
        .from(follows)
        .where(eq(follows.followerId, seller.id));
      followingCount = result[0]?.count || 0;
      await setFollowingCount(seller.id, followingCount);
    }

    // Check if current user follows this seller
    let isFollowing = false;
    if (currentUserId && currentUserId !== seller.id) {
      const cachedStatus = await getFollowStatus(currentUserId, seller.id);
      if (cachedStatus !== null) {
        isFollowing = cachedStatus;
      } else {
        const follow = await db.query.follows.findFirst({
          where: and(
            eq(follows.followerId, currentUserId),
            eq(follows.followingId, seller.id)
          ),
        });
        isFollowing = !!follow;
      }
    }

    // Check if seller follows current user (for "follows you" indicator)
    let followsYou = false;
    if (currentUserId && currentUserId !== seller.id) {
      const reverseFollow = await db.query.follows.findFirst({
        where: and(
          eq(follows.followerId, seller.id),
          eq(follows.followingId, currentUserId)
        ),
      });
      followsYou = !!reverseFollow;
    }

    return NextResponse.json({
      seller: {
        ...seller,
        specializedGenres: seller.specializedGenres
          ? JSON.parse(seller.specializedGenres)
          : [],
      },
      listings,
      collection,
      stats: {
        followers: followerCount,
        following: followingCount,
      },
      isFollowing,
      followsYou,
    });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json(
      { error: "Failed to fetch seller" },
      { status: 500 }
    );
  }
}
