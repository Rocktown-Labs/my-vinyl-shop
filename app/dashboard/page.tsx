"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react"
import { mockVinyls } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const myListings = mockVinyls.slice(0, 5)
  const totalListings = myListings.length
  const totalRevenue = myListings.reduce((sum, vinyl) => sum + vinyl.price, 0)
  const totalOrders = 12

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's your store overview</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">+20% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">+2 this week</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">+3 pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground hidden sm:block">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Listings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your most recently added vinyl records</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full text-xs sm:text-sm bg-transparent">
              <Link href="/dashboard/listings">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-3 sm:hidden">
            {myListings.map((vinyl) => (
              <div key={vinyl.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <img
                  src={vinyl.images.frontCover || "/placeholder.svg"}
                  alt={vinyl.title}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{vinyl.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{vinyl.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs capitalize px-2 py-0">
                      {vinyl.condition}
                    </Badge>
                    <span className="text-sm font-semibold">${vinyl.price}</span>
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
                {myListings.map((vinyl) => (
                  <tr key={vinyl.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vinyl.images.frontCover || "/placeholder.svg"}
                          alt={vinyl.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <span className="font-medium text-sm line-clamp-1">{vinyl.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{vinyl.artist}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {vinyl.condition}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-semibold text-sm">${vinyl.price}</td>
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
    </div>
  )
}
