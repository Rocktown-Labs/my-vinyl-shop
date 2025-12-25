import { NextResponse, type NextRequest } from "next/server";
import { searchAll, searchVinyls, searchSellers } from "@/lib/search-turso";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") as "vinyl" | "seller" | undefined;
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const naturalLanguage = searchParams.get("naturalLanguage") === "true";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    let results;

    // Use TursoDB vector search
    if (type === "vinyl") {
      results = await searchVinyls(query, { limit, naturalLanguage });
    } else if (type === "seller") {
      results = await searchSellers(query, { limit });
    } else {
      results = await searchAll(query, { limit, naturalLanguage });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
