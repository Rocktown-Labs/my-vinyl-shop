import { getRedis } from "@/lib/redis";

const FOLLOW_COUNT_TTL = 60 * 5; // 5 minutes
const FOLLOW_STATUS_TTL = 60 * 10; // 10 minutes

/**
 * Get follower count for a user (cached in Redis)
 */
export async function getFollowerCount(userId: string): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<number>(`followers:count:${userId}`);
    if (cached !== null) {
      return cached;
    }
  } catch (error) {
    console.error("Error getting follower count from Redis:", error);
  }
  return null;
}

/**
 * Set follower count in Redis cache
 */
export async function setFollowerCount(
  userId: string,
  count: number
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.setex(`followers:count:${userId}`, FOLLOW_COUNT_TTL, count);
  } catch (error) {
    console.error("Error setting follower count in Redis:", error);
  }
}

/**
 * Get following count for a user (cached in Redis)
 */
export async function getFollowingCount(
  userId: string
): Promise<number | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<number>(`following:count:${userId}`);
    if (cached !== null) {
      return cached;
    }
  } catch (error) {
    console.error("Error getting following count from Redis:", error);
  }
  return null;
}

/**
 * Set following count in Redis cache
 */
export async function setFollowingCount(
  userId: string,
  count: number
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.setex(`following:count:${userId}`, FOLLOW_COUNT_TTL, count);
  } catch (error) {
    console.error("Error setting following count in Redis:", error);
  }
}

/**
 * Check if followerId follows followingId (cached in Redis)
 */
export async function getFollowStatus(
  followerId: string,
  followingId: string
): Promise<boolean | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<boolean>(
      `follows:${followerId}:${followingId}`
    );
    if (cached !== null) {
      return cached;
    }
  } catch (error) {
    console.error("Error getting follow status from Redis:", error);
  }
  return null;
}

/**
 * Set follow status in Redis cache
 */
export async function setFollowStatus(
  followerId: string,
  followingId: string,
  isFollowing: boolean
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.setex(
      `follows:${followerId}:${followingId}`,
      FOLLOW_STATUS_TTL,
      isFollowing
    );
  } catch (error) {
    console.error("Error setting follow status in Redis:", error);
  }
}

/**
 * Invalidate follower/following counts for a user
 */
export async function invalidateFollowCounts(userId: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(`followers:count:${userId}`);
    await redis.del(`following:count:${userId}`);
  } catch (error) {
    console.error("Error invalidating follow counts:", error);
  }
}

/**
 * Invalidate follow status cache for a relationship
 */
export async function invalidateFollowStatus(
  followerId: string,
  followingId: string
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(`follows:${followerId}:${followingId}`);
    // Also invalidate reverse lookup if needed
    await redis.del(`follows:${followingId}:${followerId}`);
  } catch (error) {
    console.error("Error invalidating follow status:", error);
  }
}
