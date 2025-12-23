"use server";

import { auth } from "@clerk/nextjs/server";
import { db, messages, conversations } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  prevState: { error: string | null } | null,
  formData: FormData
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const conversationId = formData.get("conversationId") as string;
    const content = formData.get("content") as string;

    if (!content || !content.trim()) {
      return { error: "Message content is required" };
    }

    // Verify user is a participant
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    });

    if (
      !conversation ||
      (conversation.participant1Id !== userId &&
        conversation.participant2Id !== userId)
    ) {
      return { error: "Conversation not found" };
    }

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: userId,
        content: content.trim(),
        isRead: false,
        createdAt: new Date(),
      })
      .returning();

    // Update conversation's lastMessageAt
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));

    revalidatePath("/dashboard/messages");
    revalidatePath(`/dashboard/messages/${conversationId}`);

    return { error: null };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}
