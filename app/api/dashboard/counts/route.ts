import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, notifications, messages, conversations, orders } from "@/lib/db";
import { eq, and, or, ne, count } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get unread notifications count
    const unreadNotifications = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false))
      );
    const notificationsCount = unreadNotifications[0]?.count || 0;

    // Get unread messages count (messages in conversations where user is participant but not sender, and isRead = false)
    const userConversations = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )!
      );

    const conversationIds = userConversations.map((c) => c.id);
    let unreadMessagesCount = 0;

    if (conversationIds.length > 0) {
      // Count unread messages where sender is not the user
      const unreadMessages = await Promise.all(
        conversationIds.map(async (convId) => {
          const result = await db
            .select({ count: count() })
            .from(messages)
            .where(
              and(
                eq(messages.conversationId, convId),
                ne(messages.senderId, userId),
                eq(messages.isRead, false)
              )
            );
          return result[0]?.count || 0;
        })
      );
      unreadMessagesCount = unreadMessages.reduce((sum, cnt) => sum + cnt, 0);
    }

    // Get pending orders count (orders where user is seller and status is pending/processing)
    const pendingOrders = await db
      .select({ count: count() })
      .from(orders)
      .where(
        and(
          eq(orders.sellerId, userId),
          or(eq(orders.status, "pending"), eq(orders.status, "processing"))!
        )
      );
    const ordersCount = pendingOrders[0]?.count || 0;

    return NextResponse.json({
      notifications: notificationsCount,
      messages: unreadMessagesCount,
      orders: ordersCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}
