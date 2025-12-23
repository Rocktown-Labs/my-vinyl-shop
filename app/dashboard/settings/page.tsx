"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, CreditCard, Globe, Lock, Moon, Shield, Sun, User, Mail, Smartphone, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")
  const router = useRouter()
  const [stripeStatus, setStripeStatus] = useState<{
    hasAccount: boolean
    status: string | null
    accountId: string | null
    isSeller: boolean
  } | null>(null)
  const [isLoadingStripe, setIsLoadingStripe] = useState(true)
  const [isSettingUp, setIsSettingUp] = useState(false)

  useEffect(() => {
    const checkStripe = async () => {
      try {
        const res = await fetch("/api/stripe/connect/check")
        if (res.ok) {
          const data = await res.json()
          setStripeStatus(data)
        }
      } catch (error) {
        console.error("Error checking Stripe:", error)
      } finally {
        setIsLoadingStripe(false)
      }
    }
    checkStripe()
  }, [])

  const handleSetupStripe = async () => {
    setIsSettingUp(true)
    try {
      if (!stripeStatus?.hasAccount) {
        // Create account
        const accountRes = await fetch("/api/stripe/connect/create-account", {
          method: "POST",
        })
        if (!accountRes.ok) throw new Error("Failed to create account")
        const { accountId } = await accountRes.json()

        // Create onboarding link
        const linkRes = await fetch("/api/stripe/connect/create-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId }),
        })
        if (!linkRes.ok) throw new Error("Failed to create link")
        const { url } = await linkRes.json()
        window.location.href = url
      } else {
        // Create new onboarding link for existing account
        const linkRes = await fetch("/api/stripe/connect/create-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: stripeStatus.accountId }),
        })
        if (!linkRes.ok) throw new Error("Failed to create link")
        const { url } = await linkRes.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Error setting up Stripe:", error)
      alert("Failed to set up payments. Please try again.")
    } finally {
      setIsSettingUp(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 py-4 sm:py-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 h-auto p-1 gap-1">
            <TabsTrigger value="account" className="text-xs sm:text-sm py-2 px-4 whitespace-nowrap">
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm py-2 px-4 whitespace-nowrap">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm py-2 px-4 whitespace-nowrap">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm py-2 px-4 whitespace-nowrap">
              Billing
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4 sm:space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">
                    First Name
                  </Label>
                  <Input id="firstName" defaultValue="John" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">
                    Last Name
                  </Label>
                  <Input id="lastName" defaultValue="Doe" className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email
                </Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="h-11 rounded-xl" />
              </div>
              <Button className="rounded-full w-full sm:w-auto">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Password & Security
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm">
                  Current Password
                </Label>
                <Input id="currentPassword" type="password" className="h-11 rounded-xl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm">
                    New Password
                  </Label>
                  <Input id="newPassword" type="password" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">
                    Confirm Password
                  </Label>
                  <Input id="confirmPassword" type="password" className="h-11 rounded-xl" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm">Two-Factor Authentication</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Button className="rounded-full w-full sm:w-auto">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h4>
                <div className="space-y-4 pl-0 sm:pl-6">
                  {[
                    { label: "Order updates", desc: "Get notified when orders are placed or updated" },
                    { label: "New followers", desc: "When someone follows your store" },
                    { label: "Price drops", desc: "When items on your wishlist go on sale" },
                    { label: "Marketing emails", desc: "Promotions, new features, and tips" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm">{item.label}</Label>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.label !== "Marketing emails"} />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4" />
                  Push Notifications
                </h4>
                <div className="space-y-4 pl-0 sm:pl-6">
                  {[
                    { label: "Messages", desc: "When you receive a message from a buyer or seller" },
                    { label: "Order alerts", desc: "Real-time order status updates" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm">{item.label}</Label>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Theme & Display
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customize how VinylVision looks for you</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm">Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Globe },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      variant={theme === item.value ? "default" : "outline"}
                      className="h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2 rounded-xl bg-transparent"
                      onClick={() => setTheme(item.value)}
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4 sm:space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage your payment methods for purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <div className="border rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="h-8 w-12 sm:h-10 sm:w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0">
                    VISA
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 text-xs">
                  Remove
                </Button>
              </div>
              <Button variant="outline" className="w-full bg-transparent rounded-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                Seller Payouts
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Configure how you receive payments from sales
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              {isLoadingStripe ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : !stripeStatus?.hasAccount || stripeStatus?.status !== "active" ? (
                <div className="space-y-4">
                  <div className="border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">Payment setup required</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          {!stripeStatus?.hasAccount
                            ? "Connect your Stripe account to receive payments from buyers. You need this to create listings."
                            : "Complete your Stripe Connect onboarding to start receiving payments."}
                        </p>
                        <Button
                          onClick={handleSetupStripe}
                          disabled={isSettingUp}
                          size="sm"
                          className="rounded-full"
                        >
                          {isSettingUp ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Setting up...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              {!stripeStatus?.hasAccount ? "Connect Stripe Account" : "Complete Setup"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="border rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">Stripe Connect Active</p>
                        <p className="text-xs text-muted-foreground">Ready to receive payments</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-xs"
                      onClick={handleSetupStripe}
                      disabled={isSettingUp}
                    >
                      {isSettingUp ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 sm:p-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">Available Balance</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                  </div>
                  <Button className="rounded-full w-full sm:w-auto" disabled>
                    Withdraw Funds
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
