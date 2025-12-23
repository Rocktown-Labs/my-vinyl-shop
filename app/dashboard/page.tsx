import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentListings } from "@/components/dashboard/recent-listings";

export default function DashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here&apos;s your store overview
        </p>
      </div>

      <DashboardStats />
      <RecentListings />
    </div>
  );
}
