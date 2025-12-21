import { generateObject } from "ai"
import { vinylAnalysisSchema } from "@/lib/types"
import type { z } from "zod"

export type VinylAnalysis = z.infer<typeof vinylAnalysisSchema>

export async function POST(request: Request) {
  try {
    const { imageUrls, isSealed } = await request.json()

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return Response.json({ error: "At least one image URL is required" }, { status: 400 })
    }

    const contextPrompt = isSealed
      ? "This is a SEALED/NEW vinyl record. Assess the condition as mint/near-mint based on the sealed packaging condition. Focus on identifying the album and any visible wear to the shrink wrap or outer sleeve."
      : "This is a USED vinyl record. Carefully assess the condition of both the sleeve/cover and the vinyl disc if visible. Look for wear, scratches, ring wear, seam splits, writing, stickers, or any other condition issues."

    const { object } = await generateObject({
      model: "google/gemini-2.5-flash-preview-05-20",
      schema: vinylAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert vinyl record appraiser and seller. Analyze these vinyl record images and provide detailed information for creating a marketplace listing.

${contextPrompt}

Please:
1. Identify the album title, artist, year, genre, and label
2. Assess the condition honestly and specifically - note any flaws
3. Write an engaging seller description that highlights the album's appeal while being honest about condition
4. Suggest a fair market price range based on the album's desirability and condition
5. Indicate your confidence level in the identification

For pricing, consider:
- Common pressings of popular albums: $15-40
- Original pressings of classic albums: $40-150+
- Rare/limited editions: $100-500+
- Condition significantly affects value - deduct for any issues`,
            },
            ...imageUrls.map((url: string) => ({
              type: "image" as const,
              image: url,
            })),
          ],
        },
      ],
    })

    return Response.json(object)
  } catch (error) {
    console.error("Error analyzing vinyl:", error)
    return Response.json(
      { error: "Failed to analyze vinyl images. Please ensure images are clear and try again." },
      { status: 500 },
    )
  }
}
