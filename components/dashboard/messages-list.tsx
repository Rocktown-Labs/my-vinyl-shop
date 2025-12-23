"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConversations } from "@/lib/hooks/use-messages";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function MessagesList() {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
          <p className="text-muted-foreground">
            When buyers or sellers contact you, conversations will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conv) => {
        const lastMessage = conv.lastMessage;
        const otherParticipant = conv.otherParticipant;
        const isUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== conv.otherParticipant?.id;

        const lastMessageDate = lastMessage?.createdAt
          ? new Date(lastMessage.createdAt instanceof Date ? lastMessage.createdAt : lastMessage.createdAt)
          : null;

        return (
          <Link key={conv.id} href={`/dashboard/messages/${conv.id}`}>
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                {otherParticipant?.avatar ? (
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                    <Image
                      src={otherParticipant.avatar}
                      alt={otherParticipant.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted shrink-0 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{otherParticipant?.name || "Unknown"}</h3>
                    {lastMessageDate && (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {formatDistanceToNow(lastMessageDate, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className={`text-sm truncate ${isUnread ? "font-medium" : "text-muted-foreground"}`}>
                      {lastMessage.content}
                    </p>
                  )}
                  {conv.orderId && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      <Package className="h-3 w-3 mr-1" />
                      Order
                    </Badge>
                  )}
                </div>
                {isUnread && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
