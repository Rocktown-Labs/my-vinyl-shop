import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { deleteOnboardingProgress } from "@/lib/redis";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      accountType,
      displayName,
      username,
      bio,
      avatarUrl,
      location,
      country,
      genres,
      shipsWorldwide,
      subscriptionTier,
      stripeAccountId,
    } = body;

    // Get user email and subscription from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Get subscription tier from Clerk if not provided
    let finalSubscriptionTier = subscriptionTier || "free";
    const clerkSubscription = clerkUser.publicMetadata?.subscriptionTier;
    if (clerkSubscription) {
      finalSubscriptionTier = clerkSubscription as string;
    }

    // Check if username is already taken
    if (username) {
      const existing = await db.query.users.findFirst({
        where: (users, { eq, and, ne }) =>
          and(eq(users.username, username), ne(users.id, userId)),
      });
      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Build base update set (always updated)
    const baseUpdateSet = {
      username,
      displayName,
      bio,
      avatarUrl,
      location,
      country,
      specializedGenres: genres ? JSON.stringify(genres) : null,
      isSeller: accountType === "seller" || accountType === "both",
      shipsWorldwide,
      subscriptionTier: finalSubscriptionTier,
      onboardingCompleted: true,
      updatedAt: new Date(),
    };

    // Only update Stripe fields if stripeAccountId is provided
    // This preserves existing Stripe Connect data if user re-runs onboarding without providing it
    const updateSet = stripeAccountId
      ? {
          ...baseUpdateSet,
          stripeConnectAccountId: stripeAccountId,
          stripeConnectOnboardingStatus: "pending",
        }
      : baseUpdateSet;

    // Create or update user in database
    await db
      .insert(users)
      .values({
        id: userId,
        email,
        username,
        displayName,
        bio,
        avatarUrl,
        location,
        country,
        specializedGenres: genres ? JSON.stringify(genres) : null,
        isSeller: accountType === "seller" || accountType === "both",
        shipsWorldwide,
        subscriptionTier: finalSubscriptionTier,
        stripeConnectAccountId: stripeAccountId || null,
        stripeConnectOnboardingStatus: stripeAccountId ? "pending" : null,
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: updateSet,
      });

    // Update Clerk user metadata
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        isSeller: accountType === "seller" || accountType === "both",
      },
    });

    // Delete onboarding progress from Redis (non-blocking)
    try {
      await deleteOnboardingProgress(userId);
    } catch (redisError) {
      // Log but don't fail onboarding if Redis fails
      console.warn(
        "Failed to delete onboarding progress from Redis:",
        redisError
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      {
        error: "Failed to complete onboarding",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
