import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <SidebarInset>
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 hidden md:flex" />
          <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 pb-24 md:pb-4">{children}</div>
      </SidebarInset>
      <DashboardBottomNav />
    </SidebarProvider>
  )
}
