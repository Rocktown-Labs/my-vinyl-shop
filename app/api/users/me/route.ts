import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { canChangeUsername } from "@/lib/utils/username";

// GET - Get current user profile
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the most recent/complete user record if duplicates exist
    // Order by updatedAt to get the most recent one
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      orderBy: (users, { desc }) => [desc(users.updatedAt)],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...user,
        specializedGenres: user.specializedGenres
          ? JSON.parse(user.specializedGenres)
          : [],
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH - Update current user profile
export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

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
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "specializedGenres") {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Check username uniqueness and cooldown if updating
    if (body.username) {
      // Get current user to check cooldown
      const currentUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      // If user has no username currently, this is first-time setting (no cooldown)
      const isFirstTimeUsername = !currentUser?.username;

      // Check if username is actually changing
      if (currentUser?.username !== body.username) {
        // Only check cooldown if user already has a username (not first-time setting)
        if (!isFirstTimeUsername && currentUser?.username) {
          // Check 30-day cooldown
          const cooldownCheck = canChangeUsername(
            currentUser?.lastUsernameChangeAt || null
          );
          if (!cooldownCheck.canChange) {
            return NextResponse.json(
              {
                error: "Username change cooldown",
                message: `You can change your username again in ${cooldownCheck.daysRemaining} days`,
              },
              { status: 400 }
            );
          }
        }

        // Check if username is taken by another user
        const existing = await db.query.users.findFirst({
          where: (users, { eq, and, ne }) =>
            and(eq(users.username, body.username), ne(users.id, userId)),
        });
        if (existing) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 }
          );
        }

        // Update last username change date (only if not first-time setting)
        if (!isFirstTimeUsername) {
          updateData.lastUsernameChangeAt = new Date();
        }
      }
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      user: {
        ...updated,
        specializedGenres: updated.specializedGenres
          ? JSON.parse(updated.specializedGenres)
          : [],
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
