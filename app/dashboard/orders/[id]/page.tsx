import { use } from "react";
import { OrderDetail } from "@/components/dashboard/order-detail";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <OrderDetail orderId={id} />
    </div>
  );
}
