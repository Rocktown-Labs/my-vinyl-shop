"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHomeData } from "@/lib/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const genreColors: Record<string, string> = {
  Rock: "from-orange-500/20 to-red-500/20",
  Jazz: "from-blue-500/20 to-indigo-500/20",
  Electronic: "from-cyan-500/20 to-teal-500/20",
  "Hip-Hop": "from-violet-500/20 to-purple-500/20",
  Classical: "from-slate-500/20 to-gray-500/20",
  "Soul/R&B": "from-pink-500/20 to-rose-500/20",
  Punk: "from-red-500/20 to-orange-500/20",
  Metal: "from-gray-500/20 to-slate-500/20",
  Folk: "from-green-500/20 to-emerald-500/20",
  Country: "from-green-500/20 to-lime-500/20",
  Blues: "from-amber-500/20 to-yellow-500/20",
  Reggae: "from-yellow-500/20 to-green-500/20",
  World: "from-purple-500/20 to-pink-500/20",
  Soundtracks: "from-indigo-500/20 to-blue-500/20",
  Other: "from-gray-500/20 to-slate-500/20",
};

function getGenreColor(genre: string): string {
  return genreColors[genre] || "from-gray-500/20 to-slate-500/20";
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Default genres to always show (all available genres)
const defaultGenres = [
  { name: "Rock", count: 12500 },
  { name: "Jazz", count: 8200 },
  { name: "Electronic", count: 7300 },
  { name: "Hip-Hop", count: 9800 },
  { name: "Classical", count: 4200 },
  { name: "Soul/R&B", count: 6100 },
  { name: "Punk", count: 3800 },
  { name: "Metal", count: 2900 },
  { name: "Folk", count: 3400 },
  { name: "Country", count: 5100 },
  { name: "Blues", count: 4500 },
  { name: "Reggae", count: 2100 },
  { name: "World", count: 1800 },
  { name: "Soundtracks", count: 3200 },
  { name: "Other", count: 1500 },
];

export function ShopByGenreSection() {
  const { data, isLoading } = useHomeData();

  // Merge API data with default genres to ensure all genres are shown
  // Use real counts from API when available, otherwise use default counts
  const apiGenresMap = new Map(
    (data?.genres || []).map((g: { name: string; count: number }) => [g.name, g.count])
  );
  
  const genres = defaultGenres.map((defaultGenre) => ({
    name: defaultGenre.name,
    count: apiGenresMap.get(defaultGenre.name) ?? defaultGenre.count,
  }));

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-[120px] sm:w-[160px] lg:w-[180px] aspect-square rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-4">Shop by Genre</h2>
          <p className="text-muted-foreground text-sm sm:text-lg">Find records that match your taste</p>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {genres.map((genre, i) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-[120px] sm:w-[160px] lg:w-[180px]"
            >
              <Link href={`/browse?genre=${genre.name.toLowerCase()}`}>
                <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className={`p-4 sm:p-6 bg-gradient-to-br ${getGenreColor(genre.name)}`}>
                    <div className="aspect-square flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-black flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 shadow-lg">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-background flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black" />
                        </div>
                      </div>
                      <p className="font-semibold text-sm sm:text-base lg:text-lg">{genre.name}</p>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5">
                        {formatCount(genre.count)} records
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
