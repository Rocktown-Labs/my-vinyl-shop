"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MoreHorizontal, ArrowUpDown, Eye, FileText, Clock, Truck, CheckCircle2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

interface Order {
  id: string
  customer: string
  email: string
  items: {
    id: string
    name: string
    artist: string
    price: number
    image: string
  }[]
  amount: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
  deliveredDate?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-54879",
    customer: "John Smith",
    email: "j***@example.com",
    items: [
      {
        id: "1",
        name: "Kind of Blue",
        artist: "Miles Davis",
        price: 45.99,
        image: "/miles-davis-kind-of-blue-inspired.png",
      },
    ],
    amount: 45.99,
    status: "shipped",
    date: "2025-01-15",
  },
  {
    id: "ORD-54880",
    customer: "Jane Doe",
    email: "j***@example.com",
    items: [
      { id: "2", name: "Abbey Road", artist: "The Beatles", price: 65.0, image: "/beatles-abbey-road-album-cover.jpg" },
      { id: "3", name: "Purple Rain", artist: "Prince", price: 32.99, image: "/prince-purple-rain-album.jpg" },
    ],
    amount: 97.99,
    status: "pending",
    date: "2025-01-14",
  },
  {
    id: "ORD-54881",
    customer: "Mike Johnson",
    email: "m***@example.com",
    items: [
      {
        id: "4",
        name: "What's Going On",
        artist: "Marvin Gaye",
        price: 54.99,
        image: "/marvin-gaye-whats-going-on.jpg",
      },
    ],
    amount: 54.99,
    status: "delivered",
    date: "2025-01-12",
    deliveredDate: "2025-01-16",
  },
  {
    id: "ORD-54882",
    customer: "Sarah Williams",
    email: "s***@example.com",
    items: [
      { id: "5", name: "Rumours", artist: "Fleetwood Mac", price: 38.5, image: "/fleetwood-mac-rumours-album.jpg" },
    ],
    amount: 38.5,
    status: "processing",
    date: "2025-01-13",
  },
]

const inProgressOrders = mockOrders.filter(
  (o) => o.status === "pending" || o.status === "processing" || o.status === "shipped",
)
const completedOrders = mockOrders.filter((o) => o.status === "delivered")
const pendingOrders = mockOrders.filter((o) => o.status === "pending" || o.status === "processing")
const shippedOrders = mockOrders.filter((o) => o.status === "shipped")

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "customer",
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
      )
    },
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.getValue("customer")}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.items
      return (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {items.slice(0, 3).map((item, i) => (
              <img
                key={item.id}
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="h-8 w-8 rounded border-2 border-background object-cover"
                style={{ zIndex: 3 - i }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
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
      )
    },
    cell: ({ row }) => <span className="text-sm">{row.getValue("date")}</span>,
  },
  {
    accessorKey: "amount",
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
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <span className="font-semibold text-sm">{formatted}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
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
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Copy order ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function MobileOrderCard({ order }: { order: Order }) {
  const statusConfig = {
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" },
    processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", label: "Processing" },
    shipped: { icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10", label: "Shipped" },
    delivered: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Delivered" },
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <div className="flex-shrink-0 w-[260px] rounded-xl bg-card border shadow-sm overflow-hidden">
      {/* Header with status */}
      <div className={`flex items-center justify-between p-3 ${config.bg}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{order.date}</span>
      </div>

      {/* Order info */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
          <span className="font-bold text-sm">${order.amount.toFixed(2)}</span>
        </div>

        {/* Items preview */}
        <div className="flex gap-2">
          {order.items.slice(0, 3).map((item) => (
            <img
              key={item.id}
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
          ))}
          {order.items.length > 3 && (
            <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        {/* Customer */}
        <p className="text-xs text-muted-foreground truncate">{order.customer}</p>

        {/* Delivered date if applicable */}
        {order.status === "delivered" && order.deliveredDate && (
          <p className="text-xs text-green-600">Delivered {order.deliveredDate}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-3 pt-0">
        <Button variant="outline" size="sm" asChild className="flex-1 rounded-full text-xs h-8 bg-transparent">
          <Link href={`/dashboard/orders/${order.id}`}>View</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>Copy ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function OrderSection({
  title,
  orders,
  icon: Icon,
  iconColor,
}: {
  title: string
  orders: Order[]
  icon: React.ElementType
  iconColor: string
}) {
  if (orders.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </h3>
        <span className="text-xs text-muted-foreground">{orders.length}</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {orders.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [mobileTab, setMobileTab] = useState("in-progress")

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track and manage your sales</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold">{mockOrders.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">
              {mockOrders.filter((o) => o.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Shipped</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {mockOrders.filter((o) => o.status === "shipped").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {mockOrders.filter((o) => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sm:hidden">
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full h-10 p-1 bg-muted/50">
            <TabsTrigger
              value="in-progress"
              className="rounded-full text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              In Progress ({inProgressOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="complete"
              className="rounded-full text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Complete ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-4 space-y-6">
            {/* Pending/Processing Section */}
            <OrderSection title="Pending" orders={pendingOrders} icon={Clock} iconColor="text-amber-500" />

            {/* Shipped Section */}
            <OrderSection title="Shipped" orders={shippedOrders} icon={Truck} iconColor="text-purple-500" />

            {/* Empty state */}
            {inProgressOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No orders in progress</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="complete" className="mt-4 space-y-6">
            {/* Delivered Section */}
            <OrderSection title="Delivered" orders={completedOrders} icon={CheckCircle2} iconColor="text-green-500" />

            {/* Empty state */}
            {completedOrders.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No completed orders yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop/Tablet Data Table */}
      <Card className="border-0 shadow-sm hidden sm:block">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <DataTable columns={columns} data={mockOrders} searchKey="customer" searchPlaceholder="Search orders..." />
        </CardContent>
      </Card>
    </div>
  )
}
