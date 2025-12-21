"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Vinyl } from "@/lib/mock-data"

export interface CartItem {
  vinyl: Vinyl
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (vinyl: Vinyl) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((vinyl: Vinyl) => {
    setItems((current) => {
      const existing = current.find((item) => item.vinyl.id === vinyl.id)
      if (existing) {
        return current.map((item) => (item.vinyl.id === vinyl.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...current, { vinyl, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.vinyl.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((current) =>
      current
        .map((item) => (item.vinyl.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.vinyl.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
