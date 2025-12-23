"use server";

import { auth } from "@clerk/nextjs/server";
import { db, notifications } from "@/lib/db";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markNotificationsRead(
  notificationIds?: string[],
  markAllAsRead?: boolean
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    if (markAllAsRead) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    } else if (notificationIds && notificationIds.length > 0) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.userId, userId),
            inArray(notifications.id, notificationIds)
          )!
        );
    }

    revalidatePath("/dashboard/notifications");

    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { error: "Failed to mark notifications as read" };
  }
}
