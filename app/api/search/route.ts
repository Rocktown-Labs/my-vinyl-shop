import { NextResponse, type NextRequest } from "next/server";
import { searchAll, searchVinyls, searchSellers } from "@/lib/search-turso";
import { search as upstashSearch } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") as "vinyl" | "seller" | undefined;
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const naturalLanguage = searchParams.get("naturalLanguage") === "true";
  const useTurso = process.env.USE_TURSO_VECTOR_SEARCH === "true";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    let results;

    if (useTurso) {
      // Use TursoDB vector search
      if (type === "vinyl") {
        results = await searchVinyls(query, { limit, naturalLanguage });
      } else if (type === "seller") {
        results = await searchSellers(query, { limit });
      } else {
        results = await searchAll(query, { limit, naturalLanguage });
      }
    } else {
      // Fallback to Upstash Search
      const upstashResults = await upstashSearch(query, { type, limit });
      results = upstashResults.map((item: any) => ({
        id: item.id,
        type: item.type,
        title:
          item.type === "vinyl"
            ? item.title
            : item.displayName || item.username,
        subtitle:
          item.type === "vinyl"
            ? `${item.artist} • ${item.year || "Unknown"}`
            : item.bio || item.genres?.join(", ") || "Seller",
        image: item.type === "vinyl" ? item.imageUrl : item.avatarUrl,
        metadata: item,
      }));
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
