import { NextResponse, type NextRequest } from "next/server";
import { db, follows } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  getFollowerCount,
  getFollowingCount,
  setFollowerCount,
  setFollowingCount,
} from "@/lib/redis/follows";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Get follower and following counts for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Try Redis cache first
    let followerCount = await getFollowerCount(userId);
    let followingCount = await getFollowingCount(userId);

    // If not cached, query database
    if (followerCount === null) {
      const result = await db
        .select({ count: count() })
        .from(follows)
        .where(eq(follows.followingId, userId));
      followerCount = result[0]?.count || 0;
      await setFollowerCount(userId, followerCount);
    }

    if (followingCount === null) {
      const result = await db
        .select({ count: count() })
        .from(follows)
        .where(eq(follows.followerId, userId));
      followingCount = result[0]?.count || 0;
      await setFollowingCount(userId, followingCount);
    }

    return NextResponse.json({
      followers: followerCount,
      following: followingCount,
    });
  } catch (error) {
    console.error("Error fetching follow counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow counts" },
      { status: 500 }
    );
  }
}
