"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Star, SlidersHorizontal, ChevronDown, X, Search, MapPin, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { countries, genres } from "@/lib/mock-data"
import { SellersList } from "@/components/sellers/sellers-list"

export default function SellersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number>(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [shipsWorldwide, setShipsWorldwide] = useState(false)

  const activeFiltersCount =
    selectedCountries.length +
    selectedGenres.length +
    (minRating > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (shipsWorldwide ? 1 : 0) +
    (searchQuery ? 1 : 0)

  const clearAllFilters = () => {
    setSelectedCountries([])
    setSelectedGenres([])
    setMinRating(0)
    setVerifiedOnly(false)
    setShipsWorldwide(false)
  }

  const FilterContent = () => (
    <div className="space-y-6 px-1">
      {/* Verified Only */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
          className="h-4 w-4 shrink-0"
        />
        <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
          Verified sellers only
        </Label>
      </div>

      {/* Ships Worldwide */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="worldwide"
          checked={shipsWorldwide}
          onCheckedChange={(checked) => setShipsWorldwide(checked === true)}
          className="h-4 w-4 shrink-0"
        />
        <Label htmlFor="worldwide" className="text-sm font-medium cursor-pointer">
          Ships worldwide
        </Label>
      </div>

      {/* Rating Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium">Minimum Rating</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {[
            { label: "Any Rating", value: 0 },
            { label: "4.5+ Stars", value: 4.5 },
            { label: "4.0+ Stars", value: 4.0 },
            { label: "3.5+ Stars", value: 3.5 },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`rating-${option.value}`}
                checked={minRating === option.value}
                onCheckedChange={() => setMinRating(option.value)}
                className="h-4 w-4 shrink-0"
              />
              <Label htmlFor={`rating-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Country Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium">Country</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3 max-h-48 overflow-y-auto">
          {countries
            .filter((c) => c !== "All Countries")
            .map((country) => (
              <div key={country} className="flex items-center space-x-3">
                <Checkbox
                  id={`country-${country}`}
                  checked={selectedCountries.includes(country)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCountries([...selectedCountries, country])
                    } else {
                      setSelectedCountries(selectedCountries.filter((c) => c !== country))
                    }
                  }}
                  className="h-4 w-4 shrink-0"
                />
                <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                  {country}
                </Label>
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Genre Specialization Filter */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium">Genre Specialization</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3 max-h-48 overflow-y-auto">
          {genres
            .filter((g) => g !== "All Genres")
            .map((genre) => (
              <div key={genre} className="flex items-center space-x-3">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedGenres([...selectedGenres, genre])
                    } else {
                      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
                    }
                  }}
                  className="h-4 w-4 shrink-0"
                />
                <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                  {genre}
                </Label>
              </div>
            ))}
        </CollapsibleContent>
      </Collapsible>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full rounded-full bg-transparent">
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="bg-muted/30 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Discover Sellers</h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Find verified sellers from around the world with exceptional collections
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sellers by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-full"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2 bg-transparent">
                    <MapPin className="h-4 w-4" />
                    Country
                    {selectedCountries.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {selectedCountries.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4" align="end">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {countries
                      .filter((c) => c !== "All Countries")
                      .map((country) => (
                        <div key={country} className="flex items-center space-x-3">
                          <Checkbox
                            id={`desktop-country-${country}`}
                            checked={selectedCountries.includes(country)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCountries([...selectedCountries, country])
                              } else {
                                setSelectedCountries(selectedCountries.filter((c) => c !== country))
                              }
                            }}
                            className="h-4 w-4 shrink-0"
                          />
                          <Label htmlFor={`desktop-country-${country}`} className="text-sm cursor-pointer">
                            {country}
                          </Label>
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2 bg-transparent">
                    Genre
                    {selectedGenres.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {selectedGenres.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4" align="end">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {genres
                      .filter((g) => g !== "All Genres")
                      .map((genre) => (
                        <div key={genre} className="flex items-center space-x-3">
                          <Checkbox
                            id={`desktop-genre-${genre}`}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedGenres([...selectedGenres, genre])
                              } else {
                                setSelectedGenres(selectedGenres.filter((g) => g !== genre))
                              }
                            }}
                            className="h-4 w-4 shrink-0"
                          />
                          <Label htmlFor={`desktop-genre-${genre}`} className="text-sm cursor-pointer">
                            {genre}
                          </Label>
                        </div>
                      ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2 bg-transparent">
                    <Star className="h-4 w-4" />
                    Rating
                    {minRating > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {minRating}+
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-4" align="end">
                  <div className="space-y-3">
                    {[
                      { label: "Any Rating", value: 0 },
                      { label: "4.5+ Stars", value: 4.5 },
                      { label: "4.0+ Stars", value: 4.0 },
                      { label: "3.5+ Stars", value: 3.5 },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={`desktop-rating-${option.value}`}
                          checked={minRating === option.value}
                          onCheckedChange={() => setMinRating(option.value)}
                          className="h-4 w-4 shrink-0"
                        />
                        <Label htmlFor={`desktop-rating-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant={verifiedOnly ? "default" : "outline"}
                className="rounded-full gap-2"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Verified
              </Button>
            </div>

            {/* Mobile Filter Button - pops up from bottom */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden rounded-full gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-6">
                <SheetHeader className="text-left pb-4 border-b">
                  <SheetTitle>Filter Sellers</SheetTitle>
                </SheetHeader>
                <div className="py-4 overflow-y-auto h-[calc(100%-80px)]">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCountries.map((country) => (
                <Badge key={country} variant="secondary" className="gap-1 pr-1">
                  {country}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSelectedCountries(selectedCountries.filter((c) => c !== country))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedGenres.map((genre) => (
                <Badge key={genre} variant="secondary" className="gap-1 pr-1">
                  {genre}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setSelectedGenres(selectedGenres.filter((g) => g !== genre))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {minRating > 0 && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  {minRating}+ Stars
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setMinRating(0)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {verifiedOnly && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Verified
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setVerifiedOnly(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {shipsWorldwide && (
                <Badge variant="secondary" className="gap-1 pr-1">
                  Ships Worldwide
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setShipsWorldwide(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs px-2">
                Clear all
              </Button>
            </div>
          )}

          {/* Sellers Grid */}
          <SellersList
            searchQuery={searchQuery}
            selectedCountries={selectedCountries}
            selectedGenres={selectedGenres}
            minRating={minRating}
            verifiedOnly={verifiedOnly}
            shipsWorldwide={shipsWorldwide}
          />
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
