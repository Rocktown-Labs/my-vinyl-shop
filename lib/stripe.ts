import Stripe from "stripe";

/**
 * Get Stripe client instance
 * Throws error if STRIPE_SECRET_KEY is not configured
 */
export function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. " +
        "Please add it to your environment variables. " +
        "For local development, add it to .env.local. " +
        "For production, ensure it's set in your deployment environment."
    );
  }

  return new Stripe(apiKey, {
    apiVersion: "2024-12-18.acacia",
  });
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
