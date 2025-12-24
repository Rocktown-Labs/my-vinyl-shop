import type { Vinyl as DbVinyl } from "@/lib/db/schema";
import type { Vinyl as MockVinyl } from "@/lib/mock-data";

/**
 * Convert database vinyl format to VinylCard format
 */
export function dbVinylToCardFormat(vinyl: DbVinyl): MockVinyl {
  const images = vinyl.images ? JSON.parse(vinyl.images) : [];
  const frontCover =
    images.find((img: any) => img.type === "front_cover")?.url ||
    "/placeholder.svg";
  const backCover =
    images.find((img: any) => img.type === "back_cover")?.url ||
    "/placeholder.svg";
  const vinylImg =
    images.find((img: any) => img.type === "vinyl")?.url || "/placeholder.svg";

  return {
    id: vinyl.id,
    title: vinyl.title,
    artist: vinyl.artist,
    year: vinyl.year || 0,
    genre: vinyl.genre,
    condition: vinyl.condition as MockVinyl["condition"],
    price: vinyl.price || 0,
    quantity: vinyl.quantity || 1,
    images: {
      frontCover,
      backCover,
      vinyl: vinylImg,
    },
    sellerId: vinyl.userId,
    description: vinyl.description || "",
    pressInfo: undefined,
    catalogNumber: vinyl.catalogNumber || undefined,
    label: vinyl.label || undefined,
  };
}
