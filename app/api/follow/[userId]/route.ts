import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, follows, notifications, users } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import {
  invalidateFollowCounts,
  invalidateFollowStatus,
  setFollowerCount,
  setFollowingCount,
  setFollowStatus,
  getFollowStatus,
} from "@/lib/redis/follows";
import { count } from "drizzle-orm";
import { apiRatelimit } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Check if current user follows the target user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ isFollowing: false });
    }

    const { userId: targetUserId } = await params;

    // Check Redis cache first
    const cachedStatus = await getFollowStatus(currentUserId, targetUserId);
    if (cachedStatus !== null) {
      return NextResponse.json({ isFollowing: cachedStatus });
    }

    // Query database
    const follow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, currentUserId),
        eq(follows.followingId, targetUserId)
      ),
    });

    const isFollowing = !!follow;

    // Cache the result
    await setFollowStatus(currentUserId, targetUserId, isFollowing);

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}

// POST - Follow a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await apiRatelimit.limit(currentUserId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { userId: targetUserId } = await params;

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existing = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, currentUserId),
        eq(follows.followingId, targetUserId)
      ),
    });

    if (existing) {
      return NextResponse.json({ isFollowing: true });
    }

    // Create follow relationship
    await db.insert(follows).values({
      followerId: currentUserId,
      followingId: targetUserId,
    });

    // Invalidate caches
    await invalidateFollowCounts(currentUserId);
    await invalidateFollowCounts(targetUserId);
    await invalidateFollowStatus(currentUserId, targetUserId);

    // Update Redis caches with new counts
    const followerCount = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, targetUserId));
    await setFollowerCount(targetUserId, followerCount[0]?.count || 0);

    const followingCount = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, currentUserId));
    await setFollowingCount(currentUserId, followingCount[0]?.count || 0);

    await setFollowStatus(currentUserId, targetUserId, true);

    // Create notification for the followed user
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, targetUserId),
    });
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, currentUserId),
    });

    if (targetUser && currentUser) {
      await db.insert(notifications).values({
        userId: targetUserId,
        type: "follow",
        title: "New Follower",
        message: `${currentUser.displayName || currentUser.username || "Someone"} started following you`,
        linkUrl: `/seller/${currentUser.username || currentUserId}`,
        metadata: JSON.stringify({
          followerId: currentUserId,
          followerName: currentUser.displayName || currentUser.username,
        }),
      });
    }

    return NextResponse.json({ isFollowing: true });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

// DELETE - Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId: targetUserId } = await params;

    // Delete follow relationship
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, targetUserId)
        )
      );

    // Invalidate caches
    await invalidateFollowCounts(currentUserId);
    await invalidateFollowCounts(targetUserId);
    await invalidateFollowStatus(currentUserId, targetUserId);

    // Update Redis caches with new counts
    const followerCount = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, targetUserId));
    await setFollowerCount(targetUserId, followerCount[0]?.count || 0);

    const followingCount = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, currentUserId));
    await setFollowingCount(currentUserId, followingCount[0]?.count || 0);

    await setFollowStatus(currentUserId, targetUserId, false);

    return NextResponse.json({ isFollowing: false });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
