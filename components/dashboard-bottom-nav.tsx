"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Plus, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home", exact: true },
  { href: "/dashboard/listings", icon: Package, label: "Listings" },
  { href: "/dashboard/listings/new", icon: Plus, label: "New", featured: true },
  { href: "/dashboard/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

export function DashboardBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && !pathname.includes("/new")
          const Icon = item.icon

          if (item.featured) {
            return (
              <Link key={item.href} href={item.href} className="flex items-center justify-center -mt-3">
                <div className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center shadow-md">
                  <Icon className="h-4 w-4 text-background" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors relative min-w-[56px]",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="dashboardNavIndicator"
                  className="absolute -bottom-1 h-1 w-6 bg-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
