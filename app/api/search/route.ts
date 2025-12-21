import { NextResponse, type NextRequest } from "next/server"
import { search } from "@/lib/search"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") as "vinyl" | "seller" | undefined
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await search(query, { type, limit })
    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
