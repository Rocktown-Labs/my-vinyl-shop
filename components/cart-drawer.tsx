"use client"

import Link from "next/link"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"

export function CartDrawer() {
  const { items: cartItems, updateQuantity, removeItem, itemCount, subtotal } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative h-9 w-9 md:h-10 md:w-10">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 sm:px-6 pt-4 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <SheetClose asChild>
                <Button asChild variant="outline" className="rounded-full bg-transparent">
                  <Link href="/browse">Browse Records</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cartItems.map((item) => (
                <li key={item.vinyl.id} className="flex gap-4 py-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                    <img
                      src={item.vinyl.images.frontCover || "/placeholder.svg"}
                      alt={item.vinyl.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <SheetClose asChild>
                          <Link href={`/product/${item.vinyl.id}`}>
                            <h3 className="font-medium text-sm hover:text-accent transition-colors truncate">
                              {item.vinyl.title}
                            </h3>
                          </Link>
                        </SheetClose>
                        <p className="text-xs text-muted-foreground truncate">{item.vinyl.artist}</p>
                      </div>
                      <p className="font-semibold text-sm shrink-0">${(item.vinyl.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full bg-transparent"
                          onClick={() => updateQuantity(item.vinyl.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full bg-transparent"
                          onClick={() => updateQuantity(item.vinyl.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.vinyl.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="border-t px-4 sm:px-6 py-4 flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Shipping and taxes calculated at checkout.</p>
            <SheetClose asChild>
              <Button asChild size="lg" className="w-full rounded-full">
                <Link href="/checkout">Checkout</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" size="lg" className="w-full rounded-full bg-transparent" asChild>
                <Link href="/browse">
                  Continue Shopping
                  <span aria-hidden="true" className="ml-1">
                    &rarr;
                  </span>
                </Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
