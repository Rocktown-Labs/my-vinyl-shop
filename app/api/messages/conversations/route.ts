import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db, conversations, messages, users } from "@/lib/db";
import { eq, and, desc, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - List user's conversations
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get conversations where user is a participant
    const userConversations = await db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )!
      )
      .orderBy(desc(conversations.lastMessageAt));

    // Enrich with participant and last message data
    const enrichedConversations = await Promise.all(
      userConversations.map(async (conv) => {
        const otherParticipantId =
          conv.participant1Id === userId
            ? conv.participant2Id
            : conv.participant1Id;

        const otherParticipant = await db.query.users.findFirst({
          where: eq(users.id, otherParticipantId),
          columns: {
            id: true,
            displayName: true,
            username: true,
            avatarUrl: true,
          },
        });

        // Get last message
        const lastMessage = await db.query.messages.findFirst({
          where: eq(messages.conversationId, conv.id),
          orderBy: [desc(messages.createdAt)],
        });

        return {
          id: conv.id,
          otherParticipant: otherParticipant
            ? {
                id: otherParticipant.id,
                name: otherParticipant.displayName || "Unknown",
                username: otherParticipant.username || "",
                avatar: otherParticipant.avatarUrl || null,
              }
            : null,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
                isRead: lastMessage.isRead,
              }
            : null,
          orderId: conv.orderId,
          vinylId: conv.vinylId,
          createdAt: conv.createdAt,
        };
      })
    );

    return NextResponse.json({ conversations: enrichedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
