import { z } from "zod";

export const vinylAnalysisSchema = z.object({
  title: z.string().describe("The album title"),
  artist: z.string().describe("The artist or band name"),
  year: z.string().describe("The year the album was released as a string"),
  genre: z
    .enum([
      "Rock",
      "Jazz",
      "Electronic",
      "Hip-Hop",
      "Classical",
      "Soul/R&B",
      "Punk",
      "Metal",
      "Folk",
      "Country",
      "Blues",
      "Reggae",
      "World",
      "Soundtracks",
      "Other",
    ])
    .describe("The primary genre of the album"),
  label: z.string().optional().describe("The record label if visible"),
  catalogNumber: z
    .string()
    .optional()
    .describe("The catalog number if visible"),
  condition: z.object({
    overall: z
      .enum(["mint", "near-mint", "very-good", "good", "fair", "poor"])
      .describe("Overall condition assessment"),
    sleeveCondition: z
      .enum(["mint", "near-mint", "very-good", "good", "fair", "poor"])
      .describe("Sleeve/cover condition"),
    vinylCondition: z
      .enum(["mint", "near-mint", "very-good", "good", "fair", "poor"])
      .optional()
      .describe("Vinyl disc condition if visible"),
    notes: z
      .string()
      .describe(
        "Specific observations about condition - wear, scratches, seam splits, etc."
      ),
  }),
  description: z
    .string()
    .describe(
      "A seller-ready description highlighting the album's appeal, condition details, and any notable features (150-250 words)"
    ),
  priceEstimate: z.object({
    low: z.number().describe("Low end of suggested price range in USD"),
    high: z.number().describe("High end of suggested price range in USD"),
    suggested: z.number().describe("Recommended listing price in USD"),
    reasoning: z
      .string()
      .describe(
        "Brief explanation of pricing based on condition, rarity, and market value"
      ),
  }),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence level in the identification (0-100)"),
});

export type VinylAnalysis = z.infer<typeof vinylAnalysisSchema>;
