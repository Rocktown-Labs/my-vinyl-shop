import { MessagesList } from "@/components/dashboard/messages-list";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";

export default function MessagesPage() {
  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Chat with buyers and sellers</p>
      </div>
      <MessagesList />
      <DashboardBottomNav />
    </div>
  );
}
