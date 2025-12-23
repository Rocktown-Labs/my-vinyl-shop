import { FeedPosts } from "@/components/dashboard/feed-posts";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function FeedPostsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Updates from sellers you follow
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 sm:mb-6 h-9 sm:h-10">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
          <TabsTrigger value="listings" className="text-xs sm:text-sm">
            New Listings
          </TabsTrigger>
          <TabsTrigger value="deals" className="text-xs sm:text-sm">
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Suspense fallback={<FeedPostsSkeleton />}>
            <FeedPosts />
          </Suspense>
        </TabsContent>

        <TabsContent value="listings">
          <Suspense fallback={<FeedPostsSkeleton />}>
            <FeedPosts />
          </Suspense>
        </TabsContent>

        <TabsContent value="deals">
          <Suspense fallback={<FeedPostsSkeleton />}>
            <FeedPosts />
          </Suspense>
        </TabsContent>
      </Tabs>

      <DashboardBottomNav />
    </div>
  );
}
