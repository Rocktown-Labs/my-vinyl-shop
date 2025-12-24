import { Suspense } from "react";
import AnalyticsLoading from "./loading";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your sales performance and insights
        </p>
      </div>
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}
