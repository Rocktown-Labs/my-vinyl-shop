import { auth } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"

// GET - Get current user profile
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        ...user,
        specializedGenres: user.specializedGenres ? JSON.parse(user.specializedGenres) : [],
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PATCH - Update current user profile
export async function PATCH(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    const allowedFields = [
      "displayName",
      "username",
      "bio",
      "avatarUrl",
      "coverImageUrl",
      "location",
      "country",
      "website",
      "instagramHandle",
      "discogsUsername",
      "shipsWorldwide",
      "specializedGenres",
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "specializedGenres") {
          updateData[field] = JSON.stringify(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    }

    // Check username uniqueness if updating
    if (body.username) {
      const existing = await db.query.users.findFirst({
        where: (users, { eq, and, ne }) => and(eq(users.username, body.username), ne(users.id, userId)),
      })
      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    }

    const [updated] = await db.update(users).set(updateData).where(eq(users.id, userId)).returning()

    return NextResponse.json({
      user: {
        ...updated,
        specializedGenres: updated.specializedGenres ? JSON.parse(updated.specializedGenres) : [],
      },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
