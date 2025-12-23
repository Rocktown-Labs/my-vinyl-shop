"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchResults } from "./search-results";
import { useDebouncedValue } from "@/lib/hooks/use-debounce";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search vinyls and sellers... (try natural language queries!)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 rounded-full"
        />
      </div>
      {debouncedQuery && <SearchResults query={debouncedQuery} />}
    </div>
  );
}
