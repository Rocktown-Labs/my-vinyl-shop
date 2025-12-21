import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CartProvider } from "@/lib/cart-context"
import { QueryProvider } from "@/lib/query-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "my-vinyl.shop - Buy, Sell & Showcase Vinyl Records",
  description:
    "Discover, buy, and sell new and used vinyl records. Connect with sellers and explore curated collections.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans antialiased`}>
          <QueryProvider>
            <CartProvider>
              <ScrollToTop />
              {children}
            </CartProvider>
          </QueryProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
