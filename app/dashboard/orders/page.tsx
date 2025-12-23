import { OrdersTable } from "@/components/dashboard/orders-table";

export default function OrdersPage() {
  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and track your sales
        </p>
      </div>
      <OrdersTable />
    </div>
  );
}
