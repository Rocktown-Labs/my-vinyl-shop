import { Redis } from "@upstash/redis";
import { Ratelimit, type RatelimitConfig } from "@upstash/ratelimit";

// Initialize Redis only if environment variables are available
let redis: Redis | null = null;
let redisInitialized = false;

function getRedis(): Redis | null {
  if (redisInitialized) {
    return redis;
  }

  redisInitialized = true;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "Redis not configured. KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) are required."
    );
    return null;
  }

  try {
    redis = new Redis({
      url,
      token,
    });
    return redis;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    return null;
  }
}

export { getRedis };

// Rate limiters - only initialize if Redis is available
function createRatelimit(limiter: RatelimitConfig["limiter"], prefix: string) {
  const redisInstance = getRedis();
  if (!redisInstance) {
    // Return a no-op rate limiter if Redis isn't available
    return {
      limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0 }),
    };
  }
  return new Ratelimit({
    redis: redisInstance,
    limiter,
    analytics: true,
    prefix,
  });
}

export const apiRatelimit = createRatelimit(
  Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  "ratelimit:api"
);

export const uploadRatelimit = createRatelimit(
  Ratelimit.slidingWindow(10, "1 m"), // 10 uploads per minute
  "ratelimit:upload"
);

export const aiRatelimit = createRatelimit(
  Ratelimit.slidingWindow(5, "1 m"), // 5 AI requests per minute
  "ratelimit:ai"
);

// Onboarding progress functions
export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  data: {
    accountType?: "collector" | "seller" | "both";
    displayName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    location?: string;
    country?: string;
    genres?: string[];
    shipsWorldwide?: boolean;
  };
  startedAt: string;
  lastUpdatedAt: string;
}

export async function getOnboardingProgress(
  userId: string
): Promise<OnboardingProgress | null> {
  const redisInstance = getRedis();
  if (!redisInstance) {
    console.warn("Redis not available, returning null for onboarding progress");
    return null;
  }

  try {
    const progress = await redisInstance.get<OnboardingProgress>(
      `onboarding:${userId}`
    );
    return progress;
  } catch (error) {
    console.error("Error getting onboarding progress:", error);
    return null;
  }
}

export async function saveOnboardingProgress(
  userId: string,
  progress: Partial<OnboardingProgress>
): Promise<void> {
  const redisInstance = getRedis();
  if (!redisInstance) {
    console.warn("Redis not available, skipping save of onboarding progress");
    return;
  }

  try {
    const existing = await getOnboardingProgress(userId);
    const updated: OnboardingProgress = {
      currentStep: progress.currentStep ?? existing?.currentStep ?? 1,
      completedSteps: progress.completedSteps ?? existing?.completedSteps ?? [],
      data: { ...existing?.data, ...progress.data },
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
    // Expire after 7 days
    await redisInstance.setex(
      `onboarding:${userId}`,
      60 * 60 * 24 * 7,
      updated
    );
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    // Don't throw - allow onboarding to continue even if Redis fails
  }
}

export async function deleteOnboardingProgress(userId: string): Promise<void> {
  const redisInstance = getRedis();
  if (!redisInstance) {
    console.warn("Redis not available, skipping delete of onboarding progress");
    return;
  }

  try {
    await redisInstance.del(`onboarding:${userId}`);
  } catch (error) {
    console.error("Error deleting onboarding progress:", error);
    // Don't throw - allow onboarding to continue even if Redis fails
  }
}
