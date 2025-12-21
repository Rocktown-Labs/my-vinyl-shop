import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db, users } from "@/lib/db"
import { deleteOnboardingProgress } from "@/lib/redis"

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { accountType, displayName, username, bio, avatarUrl, location, country, genres, shipsWorldwide } = body

    // Get user email from Clerk
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)
    const email = clerkUser.emailAddresses[0]?.emailAddress || ""

    // Check if username is already taken
    if (username) {
      const existing = await db.query.users.findFirst({
        where: (users, { eq, and, ne }) => and(eq(users.username, username), ne(users.id, userId)),
      })
      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    }

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
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username,
          displayName,
          bio,
          avatarUrl,
          location,
          country,
          specializedGenres: genres ? JSON.stringify(genres) : null,
          isSeller: accountType === "seller" || accountType === "both",
          shipsWorldwide,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      })

    // Update Clerk user metadata
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        isSeller: accountType === "seller" || accountType === "both",
      },
    })

    // Delete onboarding progress from Redis
    await deleteOnboardingProgress(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Onboarding complete error:", error)
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 })
  }
}
