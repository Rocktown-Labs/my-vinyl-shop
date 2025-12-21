import { z } from "zod"

export const listingFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  artist: z.string().min(1, "Artist is required").max(100, "Artist must be less than 100 characters"),
  year: z.coerce.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear(), "Invalid year"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.enum(["new", "mint", "near-mint", "very-good", "good", "fair"], {
    required_error: "Condition is required",
  }),
  price: z.coerce.number().min(0.01, "Price must be greater than 0").max(10000, "Price must be less than $10,000"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Too long"),
  pressInfo: z.string().optional(),
  catalogNumber: z.string().optional(),
  label: z.string().optional(),
})

export type ListingFormValues = z.infer<typeof listingFormSchema>

export const vinylListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  artist: z.string().min(1, "Artist is required").max(100, "Artist must be less than 100 characters"),
  year: z.string().min(1, "Year is required"),
  genre: z.string().min(1, "Genre is required"),
  condition: z.string().min(1, "Vinyl condition is required"),
  sleeveCondition: z.string().min(1, "Sleeve condition is required"),
  type: z.enum(["new", "used"]),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Too long"),
  pressInfo: z.string().optional(),
  catalogNumber: z.string().optional(),
  label: z.string().optional(),
})

export type VinylListingFormData = z.infer<typeof vinylListingSchema>
