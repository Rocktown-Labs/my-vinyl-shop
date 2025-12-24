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

    // Handle user events (user.created, user.updated, user.deleted)
    if (evt.type.startsWith("user.")) {
      const userData = evt.data as any;
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
        created_at,
        updated_at,
        primary_email_address_id,
      } = userData;

      // Get primary email
      const primaryEmail =
        email_addresses?.find(
          (email: { id: string }) => email.id === primary_email_address_id
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
              subscriptionTier: "free_user", // Default to free_user
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
              console.log(
                `✅ User updated in database (already existed): ${id}`
              );
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
                subscriptionTier: "free_user", // Default to free_user
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
          console.log(`ℹ️  Unhandled user webhook event type: ${evt.type}`);
      }
    }
    // Handle billing events
    else if (
      evt.type.startsWith("subscriptionItem.") ||
      evt.type.startsWith("subscription.") ||
      evt.type.startsWith("paymentAttempt.")
    ) {
      switch (evt.type) {
        // ===== SUBSCRIPTION ITEM EVENTS =====
        case "subscriptionItem.active":
        case "subscriptionItem.updated":
        case "subscriptionItem.canceled":
        case "subscriptionItem.ended":
        case "subscriptionItem.upcoming":
        case "subscriptionItem.abandoned":
        case "subscriptionItem.incomplete":
        case "subscriptionItem.pastDue":
        case "subscriptionItem.freeTrialEnding": {
          // Handle subscription item events to sync subscription tier
          const subscriptionItem = evt.data as any;
          // B2C billing: payer_id is the user ID
          const payerId =
            subscriptionItem.payer_id || (subscriptionItem as any).payer?.id;
          // Plan key might be nested in plan object or at top level
          const planKey =
            subscriptionItem.plan_key || subscriptionItem.plan?.key;
          const status = subscriptionItem.status; // "active", "canceled", "ended", "upcoming", etc.

          if (!payerId) {
            console.warn(
              `⚠️  No payer_id in subscription item event: ${evt.type}`
            );
            break;
          }

          // Determine subscription tier based on subscription item status
          // Priority: crate_digger > vinyl_pro > free_user
          let subscriptionTier = "free_user";

          if (status === "active") {
            // If this item is active, use its plan key
            // Prioritize higher tiers
            if (planKey === "crate_digger") {
              subscriptionTier = "crate_digger";
            } else if (planKey === "vinyl_pro") {
              subscriptionTier = "vinyl_pro";
            } else if (planKey === "free_user") {
              subscriptionTier = "free_user";
            }
          } else if (status === "canceled" || status === "ended") {
            // If a paid subscription is canceled/ended, check current user tier
            // If this was the active paid plan, downgrade to free_user
            // Otherwise, keep current tier (another plan might still be active)
            const currentUser = await db.query.users.findFirst({
              where: eq(users.id, payerId),
              columns: { subscriptionTier: true },
            });

            // If the canceled plan matches current tier, downgrade to free_user
            if (currentUser?.subscriptionTier === planKey) {
              subscriptionTier = "free_user";
            } else {
              // Keep current tier (another plan is active)
              subscriptionTier = currentUser?.subscriptionTier || "free_user";
            }
          } else if (status === "upcoming") {
            // If upcoming, keep current tier until it becomes active
            const currentUser = await db.query.users.findFirst({
              where: eq(users.id, payerId),
              columns: { subscriptionTier: true },
            });
            subscriptionTier = currentUser?.subscriptionTier || "free_user";
            console.log(
              `ℹ️  Subscription item ${subscriptionItem.id} is upcoming for plan ${planKey}, keeping current tier: ${subscriptionTier}`
            );
          }

          // Update user's subscription tier
          try {
            await db
              .update(users)
              .set({
                subscriptionTier,
                updatedAt: new Date(),
              })
              .where(eq(users.id, payerId));
            console.log(
              `✅ Updated subscription tier for user ${payerId}: ${subscriptionTier} (event: ${evt.type}, plan: ${planKey}, status: ${status})`
            );
          } catch (error: any) {
            console.error(
              `❌ Failed to update subscription tier for user ${payerId}:`,
              error
            );
          }
          break;
        }

        // ===== SUBSCRIPTION EVENTS =====
        case "subscription.created":
        case "subscription.updated":
        case "subscription.active":
        case "subscription.pastDue": {
          // Handle subscription-level events
          const subscription = evt.data as any;
          const payerId = subscription.payer_id; // User ID for B2C billing

          if (!payerId) {
            console.warn(`⚠️  No payer_id in subscription event: ${evt.type}`);
            break;
          }

          // For subscription events, we might want to check all subscription items
          // For now, we'll log these events but rely on subscriptionItem events for tier updates
          console.log(
            `ℹ️  Subscription event ${evt.type} for user ${payerId} (subscription: ${subscription.id})`
          );
          break;
        }

        // ===== PAYMENT ATTEMPT EVENTS =====
        case "paymentAttempt.created":
        case "paymentAttempt.updated": {
          // Handle payment attempt events (optional - for tracking/logging)
          const paymentAttempt = evt.data as any;
          const payerId =
            paymentAttempt.payer_id || (paymentAttempt as any).payer?.id;
          const status = paymentAttempt.status; // "pending", "paid", "failed"
          const type = paymentAttempt.type || paymentAttempt.payment_type; // "checkout" or "recurring"

          console.log(
            `ℹ️  Payment attempt ${evt.type} for user ${payerId}: ${status} (type: ${type})`
          );

          // Optionally, you could create notifications or update order status here
          // For now, we'll just log
          break;
        }

        default:
          console.log(`ℹ️  Unhandled billing webhook event type: ${evt.type}`);
      }
    } else {
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
