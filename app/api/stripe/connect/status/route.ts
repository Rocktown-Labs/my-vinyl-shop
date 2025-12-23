import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.stripeConnectAccountId) {
      return NextResponse.json({
        hasAccount: false,
        status: null,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      });
    }

    let stripe;
    try {
      stripe = getStripeClient();
    } catch (error) {
      console.error("Stripe configuration error:", error);
      return NextResponse.json(
        {
          error: "Stripe is not configured",
          message:
            error instanceof Error
              ? error.message
              : "STRIPE_SECRET_KEY is missing",
        },
        { status: 503 }
      );
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectAccountId);

    // Update user status in database
    let onboardingStatus = "pending";
    if (account.details_submitted && account.charges_enabled) {
      onboardingStatus = account.payouts_enabled ? "active" : "restricted";
    }

    await db
      .update(users)
      .set({
        stripeConnectOnboardingStatus: onboardingStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      hasAccount: true,
      status: onboardingStatus,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      accountId: user.stripeConnectAccountId,
    });
  } catch (error) {
    console.error("Error checking Stripe Connect status:", error);
    return NextResponse.json(
      { error: "Failed to check account status" },
      { status: 500 }
    );
  }
}
