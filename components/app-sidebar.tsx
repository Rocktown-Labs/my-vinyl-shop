"use client"

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  User,
  Settings,
  PlusCircle,
  LogOut,
  Search,
  Rss,
  Bell,
  MessageCircle,
  Disc3,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"

const menuItems = [
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
    badge: 3,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: MessageCircle,
    badge: 1,
  },
  {
    title: "Collection",
    url: "/dashboard/collection",
    icon: Disc3,
  },
  {
    title: "Listings",
    url: "/dashboard/listings",
    icon: Package,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingBag,
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

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

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
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                      {item.badge && (
                        <Badge
                          variant="default"
                          className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/listings/new">
                    <PlusCircle />
                    <span>New Listing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/browse">
                    <Search />
                    <span>Browse Records</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>{user?.firstName?.[0] || user?.username?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium text-sm">{user?.fullName || user?.username || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => signOut({ redirectUrl: "/" })}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
