"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock order data - in real app this would come from API
const mockOrderDetails = {
  "ORD-54879": {
    id: "ORD-54879",
    customer: "John Smith",
    email: "j***@example.com",
    phone: "1***•••••40",
    date: "January 15, 2025",
    datetime: "2025-01-15",
    items: [
      {
        id: "1",
        name: "Kind of Blue",
        artist: "Miles Davis",
        description: "Original pressing. Cover shows minimal wear, vinyl is clean with no scratches.",
        price: 45.99,
        image: "/miles-davis-kind-of-blue-inspired.png",
        status: "Shipped",
        statusDate: "January 17, 2025",
        step: 2,
      },
    ],
    shippingAddress: ["John Smith", "123 Main Street", "Brooklyn, NY 11201"],
    billingAddress: ["John Smith", "123 Main Street", "Brooklyn, NY 11201"],
    subtotal: 45.99,
    shipping: 5.0,
    tax: 4.08,
    total: 55.07,
    paymentMethod: { type: "Visa", last4: "4242", expiry: "02/26" },
  },
  "ORD-54880": {
    id: "ORD-54880",
    customer: "Jane Doe",
    email: "j***@example.com",
    phone: "1***•••••55",
    date: "January 14, 2025",
    datetime: "2025-01-14",
    items: [
      {
        id: "2",
        name: "Abbey Road",
        artist: "The Beatles",
        description: "1969 UK pressing. Some shelf wear on cover, vinyl plays beautifully.",
        price: 65.0,
        image: "/beatles-abbey-road-album-cover.jpg",
        status: "Processing",
        statusDate: "January 14, 2025",
        step: 1,
      },
      {
        id: "3",
        name: "Purple Rain",
        artist: "Prince and The Revolution",
        description: "2024 reissue on purple vinyl. Sealed, never played.",
        price: 32.99,
        image: "/prince-purple-rain-album.jpg",
        status: "Processing",
        statusDate: "January 14, 2025",
        step: 1,
      },
    ],
    shippingAddress: ["Jane Doe", "456 Oak Avenue", "Austin, TX 78701"],
    billingAddress: ["Jane Doe", "456 Oak Avenue", "Austin, TX 78701"],
    subtotal: 97.99,
    shipping: 8.0,
    tax: 8.48,
    total: 114.47,
    paymentMethod: { type: "Mastercard", last4: "8888", expiry: "11/25" },
  },
  "ORD-54881": {
    id: "ORD-54881",
    customer: "Mike Johnson",
    email: "m***@example.com",
    phone: "1***•••••22",
    date: "January 12, 2025",
    datetime: "2025-01-12",
    items: [
      {
        id: "4",
        name: "What's Going On",
        artist: "Marvin Gaye",
        description: "Mint condition original pressing. Stored properly, never played.",
        price: 54.99,
        image: "/marvin-gaye-whats-going-on.jpg",
        status: "Delivered",
        statusDate: "January 16, 2025",
        step: 3,
      },
    ],
    shippingAddress: ["Mike Johnson", "789 Pine Road", "Portland, OR 97201"],
    billingAddress: ["Mike Johnson", "789 Pine Road", "Portland, OR 97201"],
    subtotal: 54.99,
    shipping: 5.0,
    tax: 4.95,
    total: 64.94,
    paymentMethod: { type: "Visa", last4: "1234", expiry: "08/27" },
  },
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const order = mockOrderDetails[id as keyof typeof mockOrderDetails]

  if (!order) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-lg font-medium mb-2">Order not found</p>
        <Button asChild variant="outline" className="rounded-full bg-transparent">
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6 px-4 sm:px-0">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:items-baseline sm:justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Order {order.id}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on <time dateTime={order.datetime}>{order.date}</time>
            </p>
          </div>
        </div>
        <Button variant="outline" className="rounded-full gap-2 w-full sm:w-auto bg-transparent">
          <FileText className="h-4 w-4" />
          View Invoice
        </Button>
      </div>

      {/* Products */}
      <div className="space-y-4 sm:space-y-6">
        {order.items.map((item) => (
          <Card key={item.id} className="border shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="sm:flex lg:col-span-7">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full aspect-square sm:size-40 rounded-xl object-cover shrink-0"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <h3 className="text-base font-medium">
                    <Link href={`/product/${item.id}`} className="hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.artist}</p>
                  <p className="mt-2 text-sm font-medium">${item.price.toFixed(2)}</p>
                  <p className="mt-3 text-sm text-muted-foreground hidden sm:block">{item.description}</p>
                </div>
              </div>

              <div className="mt-6 lg:col-span-5 lg:mt-0">
                <dl className="grid grid-cols-2 gap-x-6 text-sm">
                  <div>
                    <dt className="font-medium">Delivery address</dt>
                    <dd className="mt-3 text-muted-foreground">
                      {order.shippingAddress.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Shipping updates</dt>
                    <dd className="mt-3 text-muted-foreground space-y-1">
                      <p>{order.email}</p>
                      <p>{order.phone}</p>
                      <button className="font-medium text-accent hover:text-accent/80 transition-colors">Edit</button>
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>

            {/* Status Progress */}
            <div className="border-t p-4 sm:p-6">
              <p className="text-sm font-medium">
                {item.status} on <time>{item.statusDate}</time>
              </p>
              <div className="mt-4" aria-hidden="true">
                <div className="overflow-hidden rounded-full bg-muted">
                  <div
                    style={{ width: `calc((${item.step} * 2 + 1) / 8 * 100%)` }}
                    className="h-2 rounded-full bg-accent"
                  />
                </div>
                <div className="mt-4 hidden sm:grid grid-cols-4 text-sm font-medium text-muted-foreground">
                  <div className={cn(item.step >= 0 && "text-accent")}>Order placed</div>
                  <div className={cn("text-center", item.step >= 1 && "text-accent")}>Processing</div>
                  <div className={cn("text-center", item.step >= 2 && "text-accent")}>Shipped</div>
                  <div className={cn("text-right", item.step >= 3 && "text-accent")}>Delivered</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Billing Summary */}
      <Card className="mt-8 border shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-x-8 bg-muted/30">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm lg:col-span-7">
            <div>
              <dt className="font-medium">Billing address</dt>
              <dd className="mt-3 text-muted-foreground">
                {order.billingAddress.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Payment information</dt>
              <dd className="mt-3 flex items-start gap-3">
                <div className="px-3 py-1.5 rounded bg-background border">
                  <span className="text-xs font-medium">{order.paymentMethod.type}</span>
                </div>
                <div>
                  <p className="font-medium">Ending with {order.paymentMethod.last4}</p>
                  <p className="text-muted-foreground">Expires {order.paymentMethod.expiry}</p>
                </div>
              </dd>
            </div>
          </dl>

          <dl className="mt-8 lg:mt-0 divide-y text-sm lg:col-span-5">
            <div className="flex items-center justify-between pb-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">${order.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-medium">${order.shipping.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="font-medium">${order.tax.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between pt-4">
              <dt className="font-medium">Order total</dt>
              <dd className="font-bold text-accent">${order.total.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
