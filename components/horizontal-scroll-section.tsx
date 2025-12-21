"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface HorizontalScrollSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  viewAllHref?: string
}

export function HorizontalScrollSection({ title, subtitle, children, viewAllHref }: HorizontalScrollSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        ref.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm sm:text-lg">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {viewAllHref && (
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground text-sm">
              <Link href={viewAllHref}>
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="h-10 w-10 rounded-full border-border/50 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="h-10 w-10 rounded-full border-border/50 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory -mx-4 px-4 sm:-mx-0 sm:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </section>
  )
}
