import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

/**
 * Check if a user can create listings (has active Stripe Connect account)
 */
export async function canUserListItems(userId: string): Promise<{
  canList: boolean;
  reason?: string;
  accountId?: string;
  status?: string;
}> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { canList: false, reason: "User not found" };
    }

    // Collectors don't need Stripe Connect
    if (!user.isSeller) {
      return { canList: false, reason: "Only sellers can create listings" };
    }

    // Check if Stripe Connect is set up and active
    if (!user.stripeConnectAccountId) {
      return {
        canList: false,
        reason:
          "Stripe Connect account not set up. Please complete payment setup in your settings.",
      };
    }

    if (user.stripeConnectOnboardingStatus !== "active") {
      return {
        canList: false,
        reason:
          "Stripe Connect account is not active. Please complete the onboarding process.",
        accountId: user.stripeConnectAccountId,
        status: user.stripeConnectOnboardingStatus || "pending",
      };
    }

    return {
      canList: true,
      accountId: user.stripeConnectAccountId,
      status: "active",
    };
  } catch (error) {
    console.error("Error checking user listing capability:", error);
    return { canList: false, reason: "Error checking account status" };
  }
}
