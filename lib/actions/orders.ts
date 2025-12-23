"use server";

import { auth } from "@clerk/nextjs/server";
import { db, orders } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  prevState: { error: string | null } | null,
  formData: FormData
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled";
    const trackingNumber = formData.get("trackingNumber") as string | undefined;

    // Verify user owns the order (as seller)
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return { error: "Order not found" };
    }

    if (order.sellerId !== userId) {
      return { error: "Unauthorized" };
    }

    await db
      .update(orders)
      .set({
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);

    return { error: null };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}
