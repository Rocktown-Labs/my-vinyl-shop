import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Get user to check if account already exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding?step=5&refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding?step=6`,
      type: "account_onboarding",
    });

    // Update user with Stripe Connect account info
    await db
      .update(users)
      .set({
        stripeConnectAccountId: accountId,
        stripeConnectOnboardingStatus: "pending",
        stripeConnectOnboardingLink: accountLink.url,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe Connect link:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
