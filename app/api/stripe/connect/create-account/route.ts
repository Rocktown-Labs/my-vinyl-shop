import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: "express",
      email: undefined, // Will be set from user data
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        clerk_user_id: userId,
      },
    });

    return NextResponse.json({ accountId: account.id });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe account" },
      { status: 500 }
    );
  }
}
