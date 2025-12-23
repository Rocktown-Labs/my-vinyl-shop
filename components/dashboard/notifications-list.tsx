"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications, useMarkNotificationsRead } from "@/lib/hooks/use-notifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function NotificationsList() {
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationsRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleMarkAllAsRead = () => {
    markAsRead.mutate({ markAllAsRead: true });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You&apos;re all caught up! New notifications will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAsRead.isPending}
            className="rounded-full"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notif) => {
          const createdAt = notif.createdAt
            ? new Date(notif.createdAt instanceof Date ? notif.createdAt : notif.createdAt)
            : null;

          return (
            <Link
              key={notif.id}
              href={notif.linkUrl || "#"}
              onClick={() => {
                if (!notif.isRead) {
                  markAsRead.mutate({ notificationIds: [notif.id] });
                }
              }}
            >
              <Card className={`p-4 hover:bg-muted/50 transition-colors ${!notif.isRead ? "border-l-4 border-l-primary" : ""}`}>
                <div className="flex items-start gap-3">
                  {notif.metadata?.avatar ? (
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image
                        src={notif.metadata.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted shrink-0 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm ${!notif.isRead ? "font-semibold" : "font-medium"}`}>
                        {notif.title}
                      </h3>
                      {createdAt && (
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {formatDistanceToNow(createdAt, { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    {!notif.isRead && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
