"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDashboardStats } from "@/lib/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export function RecentListings() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentListings = data?.recentListings || [];

  if (recentListings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Recent Listings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your most recently added vinyl records
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="text-center py-8 text-muted-foreground">
            <p>No listings yet. Create your first listing to get started!</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/listings/new">Create Listing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Recent Listings</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your most recently added vinyl records
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs sm:text-sm bg-transparent">
            <Link href="/dashboard/listings">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:hidden">
          {recentListings.map((vinyl) => (
            <div key={vinyl.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              {vinyl.image ? (
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={vinyl.image}
                    alt={vinyl.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-lg bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{vinyl.title}</p>
                <p className="text-xs text-muted-foreground truncate">{vinyl.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize px-2 py-0">
                    {vinyl.condition}
                  </Badge>
                  {vinyl.price && (
                    <span className="text-sm font-semibold">${vinyl.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 rounded-full text-xs bg-transparent" asChild>
                <Link href={`/dashboard/listings/${vinyl.id}/edit`}>Edit</Link>
              </Button>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground text-sm">Album</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Artist</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm">Condition</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm text-right">Price</th>
                <th className="pb-3 font-medium text-muted-foreground text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentListings.map((vinyl) => (
                <tr key={vinyl.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {vinyl.image ? (
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                          <Image
                            src={vinyl.image}
                            alt={vinyl.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted shrink-0" />
                      )}
                      <span className="font-medium text-sm line-clamp-1">{vinyl.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{vinyl.artist}</td>
                  <td className="py-3">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {vinyl.condition}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-semibold text-sm">
                    {vinyl.price ? `$${vinyl.price.toFixed(2)}` : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <Button size="sm" variant="outline" className="rounded-full text-xs bg-transparent" asChild>
                      <Link href={`/dashboard/listings/${vinyl.id}/edit`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
