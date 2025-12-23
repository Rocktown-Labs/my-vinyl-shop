import { NotificationsList } from "@/components/dashboard/notifications-list";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Stay updated on your activity</p>
      </div>
      <NotificationsList />
      <DashboardBottomNav />
    </div>
  );
}
