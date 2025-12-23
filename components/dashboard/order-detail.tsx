"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useOrder } from "@/lib/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Order not found</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/orders">Back to Orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" },
    processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", label: "Processing" },
    shipped: { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10", label: "Shipped" },
    delivered: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Delivered" },
  };

  const status = (order.status || "pending") as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const createdAt = order.createdAt
    ? new Date(order.createdAt instanceof Date ? order.createdAt : order.createdAt)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Order {order.id}</h1>
          {createdAt && (
            <p className="text-sm text-muted-foreground">
              Placed {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Items */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Order Items</h2>
            {order.vinyl ? (
              <div className="flex items-start gap-4">
                {order.vinyl.image ? (
                  <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={order.vinyl.image}
                      alt={order.vinyl.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-muted shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{order.vinyl.title}</h3>
                  <p className="text-sm text-muted-foreground">{order.vinyl.artist}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Qty: {order.quantity}</span>
                    {order.vinyl.price && (
                      <span className="font-semibold">${order.vinyl.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Item details unavailable</p>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="secondary" className="capitalize">
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${((order.totalAmount || 0) - (order.shippingAmount || 0)).toFixed(2)}
                </span>
              </div>
              {order.shippingAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="font-medium">${order.shippingAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${order.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        {order.buyer && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Customer</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.buyer.name}</p>
                <p className="text-sm text-muted-foreground">{order.buyer.email}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping Address */}
        {order.shippingAddress && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
              <div className="text-sm space-y-1">
                {Array.isArray(order.shippingAddress) ? (
                  order.shippingAddress.map((line, i) => <p key={i}>{line}</p>)
                ) : (
                  <p>{JSON.stringify(order.shippingAddress)}</p>
                )}
              </div>
              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <p className="font-mono text-sm">{order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          View Invoice
        </Button>
      </div>
    </div>
  );
}
