import { OrdersTable } from "@/components/dashboard/orders-table";
import { Suspense } from "react";
import OrdersLoading from "./loading";

export default function OrdersPage() {
  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and track your sales
        </p>
      </div>
      <Suspense fallback={<OrdersLoading />}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
