import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { generateRandomUsername } from "@/lib/utils/username";

// Ensure this route is dynamic
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook signature and parse the event
    // verifyWebhook automatically reads CLERK_WEBHOOK_SECRET from env
    const evt = await verifyWebhook(req);

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url,
      created_at,
      updated_at,
    } = evt.data;

    // Get primary email
    const primaryEmail =
      email_addresses?.find(
        (email: { id: string }) =>
          email.id === evt.data.primary_email_address_id
      )?.email_address ||
      email_addresses?.[0]?.email_address ||
      "";

    // Combine first and last name for displayName
    const displayName =
      [first_name, last_name].filter(Boolean).join(" ") || null;

    // Generate random username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      // Try to generate a unique username
      let attempts = 0;
      while (attempts < 10) {
        finalUsername = generateRandomUsername();
        const existing = await db.query.users.findFirst({
          where: eq(users.username, finalUsername),
        });
        if (!existing) break;
        attempts++;
      }
    }

    switch (evt.type) {
      case "user.created":
        // Create new user in database
        try {
          await db.insert(users).values({
            id,
            email: primaryEmail,
            username: finalUsername || null,
            displayName: displayName,
            avatarUrl: image_url || null,
            createdAt: created_at ? new Date(created_at) : new Date(),
            updatedAt: updated_at ? new Date(updated_at) : new Date(),
          });
          console.log(`✅ User created in database: ${id}`);
        } catch (error: any) {
          // If user already exists (race condition), update instead
          if (
            error.message?.includes("UNIQUE constraint") ||
            error.message?.includes("already exists")
          ) {
            await db
              .update(users)
              .set({
                email: primaryEmail,
                username: finalUsername || null,
                displayName: displayName,
                avatarUrl: image_url || null,
                updatedAt: new Date(),
              })
              .where(eq(users.id, id));
            console.log(`✅ User updated in database (already existed): ${id}`);
          } else {
            throw error;
          }
        }
        break;

      case "user.updated":
        // Update existing user in database
        try {
          await db
            .update(users)
            .set({
              email: primaryEmail,
              // Don't update username on webhook update (only on user.created)
              displayName: displayName,
              avatarUrl: image_url || null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, id));
          console.log(`✅ User updated in database: ${id}`);
        } catch (error: any) {
          // If user doesn't exist, create it
          if (
            error.message?.includes("not found") ||
            error.message?.includes("does not exist")
          ) {
            await db.insert(users).values({
              id,
              email: primaryEmail,
              username: finalUsername || null,
              displayName: displayName,
              avatarUrl: image_url || null,
              createdAt: created_at ? new Date(created_at) : new Date(),
              updatedAt: new Date(),
            });
            console.log(`✅ User created in database (was missing): ${id}`);
          } else {
            throw error;
          }
        }
        break;

      case "user.deleted":
        // Delete user from database
        try {
          await db.delete(users).where(eq(users.id, id));
          console.log(`✅ User deleted from database: ${id}`);
        } catch (error) {
          // Log but don't fail if user doesn't exist
          console.warn(`⚠️  User not found for deletion: ${id}`, error);
        }
        break;

      default:
        console.log(`ℹ️  Unhandled webhook event type: ${evt.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook verification/processing failed:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
