import { Search } from "@upstash/search"

export const searchIndex = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
})

// Types for search results
export interface VinylSearchResult {
  id: string
  type: "vinyl"
  title: string
  artist: string
  genre: string
  year?: number
  condition: string
  price?: number
  sellerId: string
  sellerName?: string
  imageUrl?: string
}

export interface SellerSearchResult {
  id: string
  type: "seller"
  displayName: string
  username: string
  bio?: string
  avatarUrl?: string
  country?: string
  genres?: string[]
}

export type SearchResult = VinylSearchResult | SellerSearchResult

// Index a vinyl record
export async function indexVinyl(vinyl: {
  id: string
  title: string
  artist: string
  genre: string
  year?: number | null
  condition: string
  price?: number | null
  userId: string
  sellerName?: string
  images?: string | null
}) {
  const images = vinyl.images ? JSON.parse(vinyl.images) : []
  const imageUrl = images[0]?.url || null

  await searchIndex.upsert({
    id: `vinyl:${vinyl.id}`,
    data: `${vinyl.title} ${vinyl.artist} ${vinyl.genre} ${vinyl.year || ""} ${vinyl.condition}`,
    metadata: {
      id: vinyl.id,
      type: "vinyl",
      title: vinyl.title,
      artist: vinyl.artist,
      genre: vinyl.genre,
      year: vinyl.year,
      condition: vinyl.condition,
      price: vinyl.price,
      sellerId: vinyl.userId,
      sellerName: vinyl.sellerName,
      imageUrl,
    },
  })
}

// Index a seller
export async function indexSeller(seller: {
  id: string
  displayName?: string | null
  username?: string | null
  bio?: string | null
  avatarUrl?: string | null
  country?: string | null
  specializedGenres?: string | null
}) {
  const genres = seller.specializedGenres ? JSON.parse(seller.specializedGenres) : []

  await searchIndex.upsert({
    id: `seller:${seller.id}`,
    data: `${seller.displayName || ""} ${seller.username || ""} ${seller.bio || ""} ${genres.join(" ")}`,
    metadata: {
      id: seller.id,
      type: "seller",
      displayName: seller.displayName,
      username: seller.username,
      bio: seller.bio,
      avatarUrl: seller.avatarUrl,
      country: seller.country,
      genres,
    },
  })
}

// Remove from index
export async function removeFromIndex(type: "vinyl" | "seller", id: string) {
  await searchIndex.delete(`${type}:${id}`)
}

// Search function
export async function search(query: string, options?: { type?: "vinyl" | "seller"; limit?: number }) {
  const results = await searchIndex.search(query, {
    limit: options?.limit || 20,
  })

  let items = results as unknown as Array<{ metadata: SearchResult }>

  // Filter by type if specified
  if (options?.type) {
    items = items.filter((item) => item.metadata.type === options.type)
  }

  return items.map((item) => item.metadata)
}
