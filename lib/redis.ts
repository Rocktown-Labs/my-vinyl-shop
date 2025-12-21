import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Rate limiters
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 requests per minute
  analytics: true,
  prefix: "ratelimit:api",
})

export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 uploads per minute
  analytics: true,
  prefix: "ratelimit:upload",
})

export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 AI requests per minute
  analytics: true,
  prefix: "ratelimit:ai",
})

// Onboarding progress functions
export interface OnboardingProgress {
  currentStep: number
  completedSteps: number[]
  data: {
    accountType?: "collector" | "seller" | "both"
    displayName?: string
    username?: string
    bio?: string
    avatarUrl?: string
    location?: string
    country?: string
    genres?: string[]
    shipsWorldwide?: boolean
  }
  startedAt: string
  lastUpdatedAt: string
}

export async function getOnboardingProgress(userId: string): Promise<OnboardingProgress | null> {
  const progress = await redis.get<OnboardingProgress>(`onboarding:${userId}`)
  return progress
}

export async function saveOnboardingProgress(userId: string, progress: Partial<OnboardingProgress>): Promise<void> {
  const existing = await getOnboardingProgress(userId)
  const updated: OnboardingProgress = {
    currentStep: progress.currentStep ?? existing?.currentStep ?? 1,
    completedSteps: progress.completedSteps ?? existing?.completedSteps ?? [],
    data: { ...existing?.data, ...progress.data },
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  }
  // Expire after 7 days
  await redis.setex(`onboarding:${userId}`, 60 * 60 * 24 * 7, updated)
}

export async function deleteOnboardingProgress(userId: string): Promise<void> {
  await redis.del(`onboarding:${userId}`)
}
