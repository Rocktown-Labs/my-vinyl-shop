import { NextResponse, type NextRequest } from "next/server";
import { db, vinyls } from "@/lib/db";
import { eq, and, desc, asc, gte, lte, or, like, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Browse public vinyl listings with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "8");
    const offset = Number.parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sort") || "newest";
    const genre = searchParams.get("genre");
    const condition = searchParams.get("condition");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    // Build where clause
    const conditions = [eq(vinyls.isListed, true)];

    if (genre) {
      // Handle genre filter - capitalize first letter to match database format
      const genreCapitalized = genre.charAt(0).toUpperCase() + genre.slice(1);
      conditions.push(eq(vinyls.genre, genreCapitalized));
    }

    if (condition) {
      // Handle condition filter - convert from UI format (near-mint) to DB format (near_mint)
      // Also handle "new" which might be "sealed" in DB
      let conditionFormatted = condition.replace(/-/g, "_");
      if (conditionFormatted === "new") {
        conditionFormatted = "sealed";
      }
      conditions.push(eq(vinyls.condition, conditionFormatted));
    }

    if (minPrice) {
      conditions.push(gte(vinyls.price, Number.parseFloat(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(vinyls.price, Number.parseFloat(maxPrice)));
    }

    if (year) {
      // Handle decade ranges
      if (year === "2020s") {
        conditions.push(gte(vinyls.year, 2020));
      } else if (year === "2010s") {
        conditions.push(and(gte(vinyls.year, 2010), lte(vinyls.year, 2019))!);
      } else if (year === "2000s") {
        conditions.push(and(gte(vinyls.year, 2000), lte(vinyls.year, 2009))!);
      } else if (year === "1990s") {
        conditions.push(and(gte(vinyls.year, 1990), lte(vinyls.year, 1999))!);
      } else if (year === "1980s") {
        conditions.push(and(gte(vinyls.year, 1980), lte(vinyls.year, 1989))!);
      } else if (year === "1970s") {
        conditions.push(and(gte(vinyls.year, 1970), lte(vinyls.year, 1979))!);
      } else if (year === "pre-1970") {
        conditions.push(lte(vinyls.year, 1969));
      }
    }

    if (search) {
      conditions.push(
        or(
          like(vinyls.title, `%${search}%`),
          like(vinyls.artist, `%${search}%`),
          like(vinyls.genre, `%${search}%`)
        )!
      );
    }

    const whereClause =
      conditions.length > 1 ? and(...conditions)! : conditions[0];

    // Build order by clause
    let orderBy;
    switch (sortBy) {
      case "newest":
        orderBy = desc(vinyls.createdAt);
        break;
      case "price-low":
        orderBy = asc(vinyls.price);
        break;
      case "price-high":
        orderBy = desc(vinyls.price);
        break;
      case "popular":
        // For now, use newest as popularity proxy
        // TODO: Add view count or sales count for real popularity
        orderBy = desc(vinyls.createdAt);
        break;
      default:
        orderBy = desc(vinyls.createdAt);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(vinyls)
      .where(whereClause);

    // Get paginated results
    const results = await db
      .select()
      .from(vinyls)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      vinyls: results.map((vinyl) => ({
        ...vinyl,
        images: vinyl.images ? JSON.parse(vinyl.images) : [],
      })),
      pagination: {
        total: totalCount[0]?.count || 0,
        limit,
        offset,
        hasMore: (totalCount[0]?.count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Error fetching browse vinyls:", error);
    return NextResponse.json(
      { error: "Failed to fetch vinyls" },
      { status: 500 }
    );
  }
}
