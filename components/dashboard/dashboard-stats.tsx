"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardStats() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    totalListings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    conversionRate: 0,
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            From completed orders
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Active Listings</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{stats.totalListings}</div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Currently listed
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {stats.pendingOrders > 0 ? `+${stats.pendingOrders} pending` : "All processed"}
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Conversion</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{stats.conversionRate}%</div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Orders per listing
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
