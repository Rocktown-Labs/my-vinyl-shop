import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq, and, ne } from "drizzle-orm";
import { isValidUsernameFormat } from "@/lib/utils/username";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  // Validate format
  if (!isValidUsernameFormat(username)) {
    return NextResponse.json({
      available: false,
      reason:
        "Invalid format. Username must be 3-50 characters and contain only letters, numbers, underscores, and dashes.",
    });
  }

  try {
    // Check if username is taken by another user
    const existing = await db.query.users.findFirst({
      where: and(eq(users.username, username), ne(users.id, userId)),
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        reason: "Username is already taken",
      });
    }

    return NextResponse.json({
      available: true,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}
