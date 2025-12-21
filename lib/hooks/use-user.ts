"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { User } from "@/lib/db/schema"

interface UserWithGenres extends Omit<User, "specializedGenres"> {
  specializedGenres: string[]
}

// Fetch current user
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/users/me")
      if (!res.ok) throw new Error("Failed to fetch user")
      const data = await res.json()
      return data.user as UserWithGenres
    },
  })
}

// Update current user
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserWithGenres>) => {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update user")
      const data = await res.json()
      return data.user as UserWithGenres
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    },
  })
}
