"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import type { Vinyl } from "@/lib/mock-data"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface VinylCardProps {
  vinyl: Vinyl
  featured?: boolean
  compact?: boolean
  className?: string
}

export function VinylCard({ vinyl, featured = false, compact = false, className }: VinylCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(vinyl)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn("group flex-shrink-0", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        <Link href={`/product/${vinyl.id}`} className="block">
          <div className="relative overflow-hidden aspect-square">
            <motion.img
              src={vinyl.images.frontCover}
              alt={`${vinyl.title} - ${vinyl.artist}`}
              className="object-cover w-full h-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Gradient overlay for text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

            {vinyl.quantity && vinyl.quantity > 1 && (
              <Badge
                className={cn(
                  "absolute top-2 right-2 font-semibold bg-foreground text-background border-0 shadow-lg",
                  compact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
                )}
              >
                {vinyl.quantity} avail
              </Badge>
            )}

            {/* Condition badge */}
            <Badge
              className={cn(
                "absolute font-semibold backdrop-blur-sm shadow-md capitalize border-0",
                compact ? "text-[10px] px-1.5 py-0.5 top-2 left-2" : "text-xs top-2 left-2 px-2 py-0.5",
                vinyl.condition === "new"
                  ? "bg-emerald-500/90 text-white"
                  : vinyl.condition === "mint"
                    ? "bg-blue-500/90 text-white"
                    : "bg-amber-500/90 text-white",
              )}
            >
              {vinyl.condition === "new" ? "Sealed" : vinyl.condition}
            </Badge>

            {/* Like button on hover - desktop only */}
            {!compact && (
              <motion.div
                className="absolute top-2 right-2 hidden sm:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: vinyl.quantity && vinyl.quantity > 1 ? 0 : isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300",
                    isLiked ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-white/90 hover:bg-white",
                  )}
                  onClick={handleLike}
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                </Button>
              </motion.div>
            )}

            <div className={cn("absolute bottom-0 left-0 right-0 text-white", compact ? "p-2" : "p-3")}>
              <p
                className={cn(
                  "font-medium uppercase tracking-wider opacity-80",
                  compact ? "text-[8px]" : "text-[10px]",
                )}
              >
                {vinyl.genre} · {vinyl.year}
              </p>
              <h3 className={cn("font-bold leading-tight line-clamp-1", compact ? "text-xs" : "text-sm sm:text-base")}>
                {vinyl.title}
              </h3>
              <p className={cn("opacity-80 line-clamp-1", compact ? "text-[10px]" : "text-xs sm:text-sm")}>
                {vinyl.artist}
              </p>
            </div>
          </div>
        </Link>

        <div className={cn("flex items-center justify-between bg-card", compact ? "p-2" : "p-2.5 sm:p-3")}>
          <div className="flex flex-col">
            <span className={cn("font-bold tracking-tight", compact ? "text-base" : "text-lg sm:text-xl")}>
              ${vinyl.price}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {justAdded ? (
              <motion.div
                key="added"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="icon"
                  className={cn(
                    "rounded-full bg-emerald-500 hover:bg-emerald-600 text-white",
                    compact ? "h-7 w-7" : "h-8 w-8",
                  )}
                >
                  <Check className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="icon"
                  className={cn(
                    "rounded-full bg-foreground text-background hover:bg-foreground/90",
                    compact ? "h-7 w-7" : "h-8 w-8",
                  )}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
