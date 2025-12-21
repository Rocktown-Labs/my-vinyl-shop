import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/my-vinyl-shop-logo.svg"
                alt="my-vinyl.shop"
                width={140}
                height={56}
                className="w-auto h-24 py-0 px-0"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The premier marketplace for vinyl enthusiasts. Buy, sell, and discover rare records from collectors
              worldwide.
            </p>
            <div className="flex gap-4 pt-2">
              {["Twitter", "Instagram", "Discord"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/browse", label: "Browse All" },
                { href: "/browse?condition=new", label: "New Releases" },
                { href: "/browse?genre=jazz", label: "Jazz" },
                { href: "/browse?genre=rock", label: "Rock" },
                { href: "/sellers", label: "Top Sellers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Sell</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/dashboard/listings/new", label: "Create Listing" },
                { href: "/dashboard/orders", label: "Orders" },
                { href: "/dashboard/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Get notified about new arrivals and exclusive deals.
            </p>
            <div className="flex flex-col gap-2">
              <Input placeholder="Enter your email" type="email" className="h-10 rounded-lg bg-background" />
              <Button size="sm" className="h-10 rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 my-vinyl.shop. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
