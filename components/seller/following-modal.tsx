"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFollowing } from "@/lib/hooks/use-followers";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

interface FollowingModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowingModal({
  userId,
  open,
  onOpenChange,
}: FollowingModalProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowing(userId);

  const allFollowing =
    data?.pages.flatMap((page) => page.following) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-2 -mx-6 px-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : allFollowing.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Not following anyone yet</p>
            </div>
          ) : (
            <>
              {allFollowing.map((user) => {
                const userLink = user.username
                  ? `/seller/${user.username}`
                  : `/seller/${user.id}`;
                return (
                  <Link
                    key={user.id}
                    href={userLink}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={user.displayName || user.username || "User"}
                      />
                      <AvatarFallback>
                        {(user.displayName || user.username || "U")
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-sm truncate">
                          {user.displayName || user.username || "Unknown"}
                        </p>
                        {user.isVerified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                        )}
                      </div>
                      {user.bio && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
              {hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="rounded-full"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
