import { z } from "zod";

const conditionEnum = z.enum([
  "sealed",
  "mint",
  "near-mint",
  "very-good",
  "good",
  "fair",
  "poor",
]);

const pricingTypeEnum = z.enum(["fixed", "auction"]);

const recordTypeEnum = z.enum(["sealed", "used"]);

// Base vinyl schema (for both collection and listing)
// Note: images are managed separately, validated in component
export const vinylBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  artist: z
    .string()
    .min(1, "Artist is required")
    .max(200, "Artist must be less than 200 characters"),
  genre: z.string().min(1, "Genre is required"),
  year: z.string().optional(),
  condition: conditionEnum,
  sleeveCondition: z.string().optional(),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  recordType: z.string().nullable().optional(),
  showPricing: z.boolean().default(false),
  pricingType: z.enum(["fixed", "auction"]).optional(),
  price: z.string().optional(),
  startingBid: z.string().optional(),
  reservePrice: z.string().optional(),
  buyNowPrice: z.string().optional(),
  auctionDuration: z.string().default("7"),
  enableReserve: z.boolean().default(false),
  enableBuyItNow: z.boolean().default(false),
  quantity: z.string().default("1"),
});

// Collection schema (no pricing required)
export const collectionSchema = vinylBaseSchema.refine(
  (data) => {
    if (data.showPricing && data.pricingType === "fixed") {
      return (
        data.price !== null && data.price !== undefined && data.price !== ""
      );
    }
    if (data.showPricing && data.pricingType === "auction") {
      return (
        data.startingBid !== null &&
        data.startingBid !== undefined &&
        data.startingBid !== ""
      );
    }
    return true;
  },
  {
    message: "Price or starting bid is required when listing for sale",
    path: ["price"],
  }
);

// Listing schema (pricing required)
export const listingSchema = vinylBaseSchema
  .extend({
    recordType: z.string().min(1, "Record type is required"), // sealed or used
    pricingType: z.enum(["fixed", "auction"]),
  })
  .refine(
    (data) => {
      if (data.pricingType === "fixed") {
        return (
          data.price !== null && data.price !== undefined && data.price !== ""
        );
      }
      if (data.pricingType === "auction") {
        return (
          data.startingBid !== null &&
          data.startingBid !== undefined &&
          data.startingBid !== ""
        );
      }
      return true;
    },
    {
      message: "Price or starting bid is required",
      path: ["price"],
    }
  );

export type VinylBaseFormData = z.infer<typeof vinylBaseSchema>;
export type CollectionFormData = z.infer<typeof collectionSchema>;
export type ListingFormData = z.infer<typeof listingSchema>;
