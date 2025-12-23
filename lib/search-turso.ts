import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

// Vector search using TursoDB's native vector support
export interface SearchResult {
  id: string;
  type: "vinyl" | "seller";
  title: string;
  subtitle: string;
  image?: string;
  metadata?: Record<string, any>;
  score?: number;
}

/**
 * Generate embedding for a query using Google Gemini
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.embedding("models/embedding-001"),
    value: text,
  });
  return embedding;
}

/**
 * Search vinyls using vector similarity
 */
export async function searchVinyls(
  query: string,
  options?: { limit?: number; naturalLanguage?: boolean }
): Promise<SearchResult[]> {
  try {
    const limit = options?.limit || 20;

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    // Use TursoDB's vector_top_k function for similarity search
    // Note: This requires a vector index to be created on the vinyls table
    const results = await db.execute(sql`
      SELECT 
        v.id,
        v.title,
        v.artist,
        v.genre,
        v.year,
        v.condition,
        v.price,
        v.images,
        v.user_id,
        u.display_name as seller_name,
        vector_top_k('vinyls_idx', vector32(${embeddingStr}), ${limit}) as similarity
      FROM vector_top_k('vinyls_idx', vector32(${embeddingStr}), ${limit}) vt
      JOIN vinyls v ON v.rowid = vt.id
      JOIN users u ON u.id = v.user_id
      WHERE v.is_listed = 1
      ORDER BY similarity DESC
      LIMIT ${limit}
    `);

    return results.map((row: any) => {
      const images = row.images ? JSON.parse(row.images) : [];
      return {
        id: row.id,
        type: "vinyl" as const,
        title: row.title,
        subtitle: `${row.artist} • ${row.year || "Unknown"}`,
        image: images[0]?.url,
        metadata: {
          genre: row.genre,
          condition: row.condition,
          price: row.price,
          sellerId: row.user_id,
          sellerName: row.seller_name,
        },
        score: row.similarity,
      };
    });
  } catch (error) {
    console.error("Vector search error:", error);
    // Fallback to text search if vector index doesn't exist
    return fallbackTextSearch(query, options);
  }
}

/**
 * Fallback text search using SQL LIKE
 */
async function fallbackTextSearch(
  query: string,
  options?: { limit?: number }
): Promise<SearchResult[]> {
  const limit = options?.limit || 20;
  const searchTerm = `%${query}%`;

  const results = await db.execute(sql`
    SELECT 
      v.id,
      v.title,
      v.artist,
      v.genre,
      v.year,
      v.condition,
      v.price,
      v.images,
      v.user_id,
      u.display_name as seller_name
    FROM vinyls v
    JOIN users u ON u.id = v.user_id
    WHERE v.is_listed = 1
      AND (
        v.title LIKE ${searchTerm}
        OR v.artist LIKE ${searchTerm}
        OR v.genre LIKE ${searchTerm}
      )
    LIMIT ${limit}
  `);

  return results.map((row: any) => {
    const images = row.images ? JSON.parse(row.images) : [];
    return {
      id: row.id,
      type: "vinyl" as const,
      title: row.title,
      subtitle: `${row.artist} • ${row.year || "Unknown"}`,
      image: images[0]?.url,
      metadata: {
        genre: row.genre,
        condition: row.condition,
        price: row.price,
        sellerId: row.user_id,
        sellerName: row.seller_name,
      },
    };
  });
}

/**
 * Search sellers using vector similarity
 */
export async function searchSellers(
  query: string,
  options?: { limit?: number }
): Promise<SearchResult[]> {
  try {
    const limit = options?.limit || 20;
    const queryEmbedding = await generateEmbedding(query);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const results = await db.execute(sql`
      SELECT 
        u.id,
        u.display_name,
        u.username,
        u.bio,
        u.avatar_url,
        u.country,
        u.specialized_genres,
        vector_top_k('sellers_idx', vector32(${embeddingStr}), ${limit}) as similarity
      FROM vector_top_k('sellers_idx', vector32(${embeddingStr}), ${limit}) st
      JOIN users u ON u.rowid = st.id
      WHERE u.is_seller = 1 AND u.onboarding_completed = 1
      ORDER BY similarity DESC
      LIMIT ${limit}
    `);

    return results.map((row: any) => {
      const genres = row.specialized_genres
        ? JSON.parse(row.specialized_genres)
        : [];
      return {
        id: row.id,
        type: "seller" as const,
        title: row.display_name || row.username || "Unknown",
        subtitle: row.bio || genres.join(", ") || "Seller",
        image: row.avatar_url,
        metadata: {
          username: row.username,
          country: row.country,
          genres,
        },
        score: row.similarity,
      };
    });
  } catch (error) {
    console.error("Vector search error:", error);
    return fallbackSellerSearch(query, options);
  }
}

/**
 * Fallback seller text search
 */
async function fallbackSellerSearch(
  query: string,
  options?: { limit?: number }
): Promise<SearchResult[]> {
  const limit = options?.limit || 20;
  const searchTerm = `%${query}%`;

  const results = await db.execute(sql`
    SELECT 
      u.id,
      u.display_name,
      u.username,
      u.bio,
      u.avatar_url,
      u.country,
      u.specialized_genres
    FROM users u
    WHERE u.is_seller = 1 
      AND u.onboarding_completed = 1
      AND (
        u.display_name LIKE ${searchTerm}
        OR u.username LIKE ${searchTerm}
        OR u.bio LIKE ${searchTerm}
      )
    LIMIT ${limit}
  `);

  return results.map((row: any) => {
    const genres = row.specialized_genres
      ? JSON.parse(row.specialized_genres)
      : [];
    return {
      id: row.id,
      type: "seller" as const,
      title: row.display_name || row.username || "Unknown",
      subtitle: row.bio || genres.join(", ") || "Seller",
      image: row.avatar_url,
      metadata: {
        username: row.username,
        country: row.country,
        genres,
      },
    };
  });
}

/**
 * Combined search (vinyls and sellers)
 */
export async function searchAll(
  query: string,
  options?: { limit?: number; naturalLanguage?: boolean }
): Promise<SearchResult[]> {
  const limit = options?.limit || 20;
  const perType = Math.floor(limit / 2);

  const [vinyls, sellers] = await Promise.all([
    searchVinyls(query, {
      limit: perType,
      naturalLanguage: options?.naturalLanguage,
    }),
    searchSellers(query, { limit: perType }),
  ]);

  // Combine and sort by relevance (score if available)
  const combined = [...vinyls, ...sellers].sort((a, b) => {
    if (a.score && b.score) return b.score - a.score;
    if (a.score) return -1;
    if (b.score) return 1;
    return 0;
  });

  return combined.slice(0, limit);
}
