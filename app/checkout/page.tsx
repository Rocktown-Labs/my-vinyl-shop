"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const subtotal = 111.48
  const shipping = 8.99
  const tax = 8.92
  const total = 129.39

  const handleCheckout = async () => {
    console.log("[v0] Processing checkout with Stripe...")
    alert("Checkout functionality will be integrated with Stripe!")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" asChild>
              <Link href="/cart">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Contact Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm">
                        First Name
                      </Label>
                      <Input id="firstName" placeholder="John" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm">
                        Last Name
                      </Label>
                      <Input id="lastName" placeholder="Doe" className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">
                      Email
                    </Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">
                      Phone Number
                    </Label>
                    <Input id="phone" type="tel" placeholder="(555) 555-5555" className="h-11 rounded-xl" />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">
                      Street Address
                    </Label>
                    <Input id="address" placeholder="123 Main St" className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment" className="text-sm">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input id="apartment" placeholder="Apt 4B" className="h-11 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm">
                        City
                      </Label>
                      <Input id="city" placeholder="New York" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm">
                        State
                      </Label>
                      <Input id="state" placeholder="NY" className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2 sm:w-1/2">
                    <Label htmlFor="zipCode" className="text-sm">
                      ZIP Code
                    </Label>
                    <Input id="zipCode" placeholder="10001" className="h-11 rounded-xl" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup defaultValue="card">
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border rounded-xl">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer flex-1 text-sm sm:text-base"
                      >
                        <CreditCard className="h-4 w-4" />
                        Credit or Debit Card
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-sm">
                        Card Number
                      </Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="h-11 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry" className="text-sm">
                          Expiry Date
                        </Label>
                        <Input id="expiry" placeholder="MM/YY" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc" className="text-sm">
                          CVC
                        </Label>
                        <Input id="cvc" placeholder="123" className="h-11 rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-4">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary - Sticky on desktop, fixed on mobile */}
            <div className="lg:block">
              <Card className="lg:sticky lg:top-24 border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
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
                  <Button size="lg" className="w-full rounded-full h-12" onClick={handleCheckout}>
                    Complete Order
                  </Button>
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    By completing your order, you agree to our terms of service and privacy policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
