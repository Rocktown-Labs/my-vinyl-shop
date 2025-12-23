"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MoreHorizontal, ArrowUpDown, Eye, FileText, Clock, Truck, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useOrders } from "@/lib/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import type { EnrichedOrder } from "@/lib/hooks/use-orders";

const columns: ColumnDef<EnrichedOrder>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "buyer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const buyer = row.original.buyer;
      return buyer ? (
        <div>
          <p className="font-medium text-sm">{buyer.name}</p>
          <p className="text-xs text-muted-foreground">{buyer.email}</p>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Unknown</span>
      );
    },
  },
  {
    accessorKey: "vinyl",
    header: "Item",
    cell: ({ row }) => {
      const vinyl = row.original.vinyl;
      if (!vinyl) return <span className="text-sm text-muted-foreground">N/A</span>;
      return (
        <div className="flex items-center gap-2">
          {vinyl.image ? (
            <div className="h-8 w-8 rounded border-2 border-background overflow-hidden shrink-0">
              <Image
                src={vinyl.image}
                alt={vinyl.title}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded border-2 border-background bg-muted shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{vinyl.title}</p>
            <p className="text-xs text-muted-foreground truncate">{vinyl.artist}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return <span className="text-sm">—</span>;
      const dateObj = date instanceof Date ? date : new Date(date);
      return <span className="text-sm">{dateObj.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      if (!amount) return <span className="text-sm">—</span>;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="font-semibold text-sm">{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "delivered"
              ? "default"
              : status === "shipped"
                ? "outline"
                : status === "processing"
                  ? "secondary"
                  : "secondary"
          }
          className="capitalize text-xs"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
              Copy order ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function MobileOrderCard({ order }: { order: EnrichedOrder }) {
  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" },
    processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", label: "Processing" },
    shipped: { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10", label: "Shipped" },
    delivered: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Delivered" },
  };

  const status = (order.status || "pending") as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const date = order.createdAt
    ? new Date(order.createdAt instanceof Date ? order.createdAt : order.createdAt).toLocaleDateString()
    : "—";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">{order.id}</span>
            <Badge variant="secondary" className="capitalize text-xs">
              {order.status}
            </Badge>
          </div>
          {order.buyer && (
            <p className="text-sm text-muted-foreground mb-2">{order.buyer.name}</p>
          )}
          {order.vinyl && (
            <div className="flex items-center gap-2 mb-2">
              {order.vinyl.image ? (
                <div className="h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                  <Image
                    src={order.vinyl.image}
                    alt={order.vinyl.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded bg-muted shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{order.vinyl.title}</p>
                <p className="text-xs text-muted-foreground truncate">{order.vinyl.artist}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{date}</span>
            {order.totalAmount && (
              <span className="font-semibold text-sm">${order.totalAmount.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className={`${config.bg} ${config.color} p-2 rounded-lg shrink-0`}>
          <StatusIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/orders/${order.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function OrdersTable() {
  const { data: allOrders, isLoading } = useOrders({ role: "seller" });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const orders = allOrders || [];
  const inProgressOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing" || o.status === "shipped"
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing");
  const shippedOrders = orders.filter((o) => o.status === "shipped");

  if (orders.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground">
            When customers purchase your listings, they&apos;ll appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress ({inProgressOrders.length})</TabsTrigger>
        <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="sm:hidden space-y-3">
          {orders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>
        <Card className="border-0 shadow-sm hidden sm:block">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">All Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <DataTable columns={columns} data={orders} searchKey="id" searchPlaceholder="Search orders..." />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="in-progress" className="space-y-4">
        <div className="sm:hidden space-y-3">
          {inProgressOrders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>
        <Card className="border-0 shadow-sm hidden sm:block">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <DataTable columns={columns} data={inProgressOrders} searchKey="id" searchPlaceholder="Search orders..." />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        <div className="sm:hidden space-y-3">
          {pendingOrders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>
        <Card className="border-0 shadow-sm hidden sm:block">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <DataTable columns={columns} data={pendingOrders} searchKey="id" searchPlaceholder="Search orders..." />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        <div className="sm:hidden space-y-3">
          {completedOrders.map((order) => (
            <MobileOrderCard key={order.id} order={order} />
          ))}
        </div>
        <Card className="border-0 shadow-sm hidden sm:block">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <DataTable columns={columns} data={completedOrders} searchKey="id" searchPlaceholder="Search orders..." />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
