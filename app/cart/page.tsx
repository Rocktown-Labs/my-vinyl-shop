"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { mockVinyls } from "@/lib/mock-data"

interface CartItem {
  vinyl: (typeof mockVinyls)[0]
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { vinyl: mockVinyls[0], quantity: 1 },
    { vinyl: mockVinyls[2], quantity: 2 },
    { vinyl: mockVinyls[4], quantity: 1 },
  ])

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.vinyl.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.vinyl.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.vinyl.price * item.quantity, 0)
  const shipping = 8.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-muted-foreground text-base sm:text-lg mb-4">Your cart is empty</p>
              <Button asChild className="rounded-full">
                <Link href="/browse">Browse Vinyl</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.vinyl.id} className="border-0 shadow-sm">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={item.vinyl.images.frontCover || "/placeholder.svg"}
                          alt={item.vinyl.title}
                          className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg sm:rounded-xl object-cover"
                        />
                        <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link href={`/product/${item.vinyl.id}`}>
                                <h3 className="font-semibold text-sm sm:text-base hover:text-accent transition-colors truncate">
                                  {item.vinyl.title}
                                </h3>
                              </Link>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.vinyl.artist}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.vinyl.id)}
                              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between pt-1 sm:pt-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent rounded-full"
                                onClick={() => updateQuantity(item.vinyl.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent rounded-full"
                                onClick={() => updateQuantity(item.vinyl.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-sm sm:text-base">
                              ${(item.vinyl.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24 border-0 shadow-sm">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Order Summary</h2>
                    <Separator />
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base sm:text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${total.toFixed(2)}</span>
                    </div>
                    <Button size="lg" className="w-full rounded-full h-11 sm:h-12" asChild>
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent rounded-full h-11 sm:h-12"
                      asChild
                    >
                      <Link href="/browse">Continue Shopping</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
