"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, User, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/browse", icon: ShoppingBag, label: "Browse" },
  { href: null, icon: Search, label: "Search", featured: true }, // Opens search modal
  { href: "/sellers", icon: User, label: "Sellers" },
  { href: "/dashboard", icon: User, label: "Account" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Don't show on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const isActive =
              item.href && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
            const Icon = item.icon

            if (item.featured) {
              return (
                <Sheet key={index} open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <SheetTrigger asChild>
                    <button className="flex items-center justify-center -mt-3">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-full bg-foreground flex items-center justify-center shadow-md">
                          <Icon className="h-5 w-5 text-background" />
                        </div>
                      </div>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="top" className="h-auto">
                    <div className="pt-6 pb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search records..."
                          className="pl-10 h-12 text-base"
                          autoFocus
                        />
                      </div>
                      {searchQuery && (
                        <div className="mt-4">
                          <Button
                            className="w-full"
                            onClick={() => {
                              setIsSearchOpen(false)
                              // Navigate to browse with search query
                              window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`
                            }}
                          >
                            Search for "{searchQuery}"
                          </Button>
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors relative min-w-[56px]",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 h-1 w-6 bg-foreground rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
