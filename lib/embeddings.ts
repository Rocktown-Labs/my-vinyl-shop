import { db, users, vinyls } from "@/lib/db";
import { sql, eq } from "drizzle-orm";
import { embed } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Generate embedding for text using Google Gemini embedding-001 model
 * Returns a 768-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.textEmbedding("models/embedding-001"),
    value: text,
  });
  return embedding;
}

/**
 * Generate searchable text from user data
 */
function getUserSearchText(user: {
  displayName?: string | null;
  username?: string | null;
  bio?: string | null;
  specializedGenres?: string | null;
  location?: string | null;
  country?: string | null;
}): string {
  const parts: string[] = [];

  if (user.displayName) parts.push(user.displayName);
  if (user.username) parts.push(user.username);
  if (user.bio) parts.push(user.bio);
  if (user.location) parts.push(user.location);
  if (user.country) parts.push(user.country);
  if (user.specializedGenres) {
    try {
      const genres = JSON.parse(user.specializedGenres);
      if (Array.isArray(genres)) {
        parts.push(...genres);
      }
    } catch {
      // Ignore parse errors
    }
  }

  return parts.join(" ");
}

/**
 * Generate searchable text from vinyl data
 */
function getVinylSearchText(vinyl: {
  title: string;
  artist: string;
  genre: string;
  year?: number | null;
  label?: string | null;
  description?: string | null;
  condition: string;
}): string {
  const parts: string[] = [
    vinyl.title,
    vinyl.artist,
    vinyl.genre,
    vinyl.condition,
  ];

  if (vinyl.year) parts.push(vinyl.year.toString());
  if (vinyl.label) parts.push(vinyl.label);
  if (vinyl.description) parts.push(vinyl.description);

  return parts.join(" ");
}

/**
 * Update user embedding
 */
export async function updateUserEmbedding(userId: string): Promise<void> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const searchText = getUserSearchText(user);
  if (!searchText.trim()) {
    // No searchable content, skip embedding
    return;
  }

  const embedding = await generateEmbedding(searchText);

  await db
    .update(users)
    .set({
      embedding: sql`vector32(${JSON.stringify(embedding)})`,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/**
 * Update vinyl embedding
 */
export async function updateVinylEmbedding(vinylId: string): Promise<void> {
  const vinyl = await db.query.vinyls.findFirst({
    where: eq(vinyls.id, vinylId),
  });

  if (!vinyl) {
    throw new Error(`Vinyl ${vinylId} not found`);
  }

  const searchText = getVinylSearchText(vinyl);
  if (!searchText.trim()) {
    // No searchable content, skip embedding
    return;
  }

  const embedding = await generateEmbedding(searchText);

  await db
    .update(vinyls)
    .set({
      embedding: sql`vector32(${JSON.stringify(embedding)})`,
      updatedAt: new Date(),
    })
    .where(eq(vinyls.id, vinylId));
}

/**
 * Batch update embeddings for all users (useful for initial migration)
 */
export async function batchUpdateUserEmbeddings(
  limit?: number
): Promise<number> {
  const allUsers = await db.query.users.findMany({
    limit: limit || 1000,
  });

  let updated = 0;
  for (const user of allUsers) {
    try {
      await updateUserEmbedding(user.id);
      updated++;
    } catch (error) {
      console.error(`Failed to update embedding for user ${user.id}:`, error);
    }
  }

  return updated;
}

/**
 * Batch update embeddings for all vinyls (useful for initial migration)
 */
export async function batchUpdateVinylEmbeddings(
  limit?: number
): Promise<number> {
  const allVinyls = await db.query.vinyls.findMany({
    limit: limit || 1000,
  });

  let updated = 0;
  for (const vinyl of allVinyls) {
    try {
      await updateVinylEmbedding(vinyl.id);
      updated++;
    } catch (error) {
      console.error(`Failed to update embedding for vinyl ${vinyl.id}:`, error);
    }
  }

  return updated;
}
