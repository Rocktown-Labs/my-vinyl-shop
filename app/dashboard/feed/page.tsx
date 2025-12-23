import { FeedPosts } from "@/components/dashboard/feed-posts";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <FeedPosts />
        </TabsContent>

        <TabsContent value="listings">
          <FeedPosts />
        </TabsContent>

        <TabsContent value="deals">
          <FeedPosts />
        </TabsContent>
      </Tabs>

      <DashboardBottomNav />
    </div>
  );
}
