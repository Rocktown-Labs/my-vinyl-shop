"use client"

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  Settings,
  PlusCircle,
  Search,
  Rss,
  Bell,
  MessageCircle,
  Disc3,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { useDashboardCounts } from "@/lib/hooks/use-dashboard-counts"

// Platform category - general platform features
const platformItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Feed",
    url: "/dashboard/feed",
    icon: Rss,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
    showBadge: true,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageCircle,
    showBadge: true,
  },
  {
    title: "Collection",
    url: "/dashboard/collection",
    icon: Disc3,
  },
]

// Seller category - seller-specific features
const sellerItems = [
  {
    title: "Listings",
    url: "/dashboard/listings",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingBag,
    showBadge: true,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

// Quick Actions
const quickActions = [
  {
    title: "New Listing",
    url: "/dashboard/listings/new",
    icon: PlusCircle,
  },
  {
    title: "Browse Records",
    url: "/browse",
    icon: Search,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: counts } = useDashboardCounts()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href="/">
                <Image
                  src="/my-vinyl-shop-logo.svg"
                  alt="my-vinyl.shop"
                  width={160}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {platformItems.map((item) => {
                const badgeCount =
                  item.title === "Notifications"
                    ? counts?.notifications || 0
                    : item.title === "Messages"
                      ? counts?.messages || 0
                      : 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </span>
                        {item.showBadge && badgeCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Seller</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sellerItems.map((item) => {
                const badgeCount =
                  item.title === "Orders" ? counts?.orders || 0 : 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </span>
                        {item.showBadge && badgeCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                          >
                            {badgeCount}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-center w-full p-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonPopoverCard: "shadow-lg border",
                    userButtonPopoverActions: "gap-1",
                    userButtonPopoverActionButton: "rounded-lg",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
