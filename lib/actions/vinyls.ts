"use server";

import { auth } from "@clerk/nextjs/server";
import { db, vinyls } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { canUserListItems } from "@/lib/stripe-connect";

export async function createVinyl(
  prevState: { error: string | null } | null,
  formData: FormData
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const isListed = formData.get("isListed") === "true";

    // Check if user can create listings (Stripe Connect validation)
    if (isListed) {
      const listingCheck = await canUserListItems(userId);
      if (!listingCheck.canList) {
        return {
          error: listingCheck.reason || "Cannot create listing",
          requiresStripeConnect: true,
        };
      }
    }

    const [newVinyl] = await db
      .insert(vinyls)
      .values({
        userId,
        title: formData.get("title") as string,
        artist: formData.get("artist") as string,
        genre: formData.get("genre") as string,
        year: formData.get("year")
          ? Number.parseInt(formData.get("year") as string)
          : null,
        label: (formData.get("label") as string) || null,
        catalogNumber: (formData.get("catalogNumber") as string) || null,
        description: (formData.get("description") as string) || null,
        condition: formData.get("condition") as string,
        sleeveCondition: (formData.get("sleeveCondition") as string) || null,
        vinylCondition: (formData.get("vinylCondition") as string) || null,
        type: (formData.get("type") as string) || "used",
        images: formData.get("images")
          ? JSON.stringify(JSON.parse(formData.get("images") as string))
          : null,
        isListed: isListed,
        isInCollection: formData.get("isInCollection") === "true",
        price: formData.get("price")
          ? Number.parseFloat(formData.get("price") as string)
          : null,
        listingType: (formData.get("listingType") as string) || "fixed",
        startingBid: formData.get("startingBid")
          ? Number.parseFloat(formData.get("startingBid") as string)
          : null,
        reservePrice: formData.get("reservePrice")
          ? Number.parseFloat(formData.get("reservePrice") as string)
          : null,
        buyNowPrice: formData.get("buyNowPrice")
          ? Number.parseFloat(formData.get("buyNowPrice") as string)
          : null,
        quantity: formData.get("quantity")
          ? Number.parseInt(formData.get("quantity") as string)
          : 1,
        aiSuggestedPrice: formData.get("aiSuggestedPrice")
          ? Number.parseFloat(formData.get("aiSuggestedPrice") as string)
          : null,
        aiConditionNotes: (formData.get("aiConditionNotes") as string) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/listings");
    revalidatePath("/dashboard/collection");

    return { success: true, vinyl: newVinyl };
  } catch (error) {
    console.error("Error creating vinyl:", error);
    return { error: "Failed to create vinyl" };
  }
}
