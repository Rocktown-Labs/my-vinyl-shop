"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDrawer } from "@/components/cart-drawer"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function SiteHeader() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center gap-3 sm:gap-6">
        <Sheet>
          <SheetTrigger asChild className="hidden md:flex lg:hidden">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex items-center gap-2 mb-8 mt-4">
              <Image
                src="/my-vinyl-shop-logo.svg"
                alt="my-vinyl.shop"
                width={150}
                height={60}
                className="h-10 w-auto"
              />
            </div>
            <nav className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home" },
                { href: "/browse", label: "Browse" },
                { href: "/sellers", label: "Sellers" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium py-3 px-4 rounded-lg transition-colors",
                    isActive(link.href) ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center shrink-0 md:-ml-2 lg:ml-0">
          <Image
            src="/my-vinyl-shop-logo.svg"
            alt="my-vinyl.shop"
            width={160}
            height={64}
            className="h-8 md:h-14 lg:h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-1 ml-4">
          {[
            { href: "/", label: "Home" },
            { href: "/browse", label: "Browse" },
            { href: "/sellers", label: "Sellers" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium px-4 py-2 rounded-full transition-colors",
                isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex flex-1 items-center justify-end gap-3">
          {/* Search bar removed - handled by mobile bottom nav search drawer on small screens */}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <CartDrawer />
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden rounded-full font-medium h-8 px-3 text-xs bg-transparent"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignInButton>
              <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign In</span>
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="hidden sm:inline-flex h-10 px-5 rounded-full font-medium">
                Start Selling
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Hide UserButton on mobile when on home page - it's in bottom nav */}
              <div className={pathname === "/" ? "hidden md:block" : ""}>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                      userButtonPopoverCard: "shadow-lg border",
                      userButtonPopoverActions: "gap-1",
                      userButtonPopoverActionButton: "rounded-lg",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
              <Button
                variant="default"
                size="sm"
                className="md:hidden rounded-full font-medium h-8 px-3 text-xs"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="default" size="sm" className="hidden md:inline-flex rounded-full font-medium h-10 px-5" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
