"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Filter, X, ChevronDown } from "lucide-react"
import { mockVinyls, genres, conditions } from "@/lib/mock-data"
import { VinylCard } from "@/components/vinyl-card"
import { motion, AnimatePresence } from "motion/react"
import { Badge } from "@/components/ui/badge"

const sortOptions = [
  { name: "Most Popular", value: "popular" },
  { name: "Best Rating", value: "rating" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-low" },
  { name: "Price: High to Low", value: "price-high" },
]

const filterSections = [
  {
    id: "genre",
    name: "Genre",
    options: genres.slice(1).map((g) => ({ value: g.toLowerCase(), label: g })),
  },
  {
    id: "condition",
    name: "Condition",
    options: conditions.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1).replace("-", " ") })),
  },
  {
    id: "year",
    name: "Year",
    options: [
      { value: "2020s", label: "2020s" },
      { value: "2010s", label: "2010s" },
      { value: "2000s", label: "2000s" },
      { value: "1990s", label: "1990s" },
      { value: "1980s", label: "1980s" },
      { value: "1970s", label: "1970s" },
      { value: "pre-1970", label: "Pre-1970" },
    ],
  },
]

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    genre: [],
    condition: [],
    year: [],
  })
  const [priceRange, setPriceRange] = useState([0, 100])
  const [sortBy, setSortBy] = useState("popular")
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (hasInitialized) return

    const genreParam = searchParams.get("genre")
    const conditionParam = searchParams.get("condition")
    const yearParam = searchParams.get("year")
    const sortParam = searchParams.get("sort")

    const hasUrlFilters = genreParam || conditionParam || yearParam || sortParam

    if (hasUrlFilters) {
      setSelectedFilters({
        genre: genreParam ? [genreParam.toLowerCase()] : [],
        condition: conditionParam ? [conditionParam.toLowerCase()] : [],
        year: yearParam ? [yearParam.toLowerCase()] : [],
      })

      if (sortParam) {
        setSortBy(sortParam)
      }
    }

    setHasInitialized(true)
  }, [searchParams, hasInitialized])

  const toggleFilter = (sectionId: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].includes(value)
        ? prev[sectionId].filter((v) => v !== value)
        : [...prev[sectionId], value],
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({ genre: [], condition: [], year: [] })
    setPriceRange([0, 100])
  }

  const activeFiltersCount = Object.values(selectedFilters).flat().length

  const filteredVinyls = mockVinyls.filter((vinyl) => {
    if (selectedFilters.genre.length > 0 && !selectedFilters.genre.includes(vinyl.genre.toLowerCase())) return false
    if (selectedFilters.condition.length > 0 && !selectedFilters.condition.includes(vinyl.condition)) return false
    if (vinyl.price < priceRange[0] || vinyl.price > priceRange[1]) return false
    return true
  })

  const MobileFilterContent = () => (
    <div className="space-y-0 px-1">
      {filterSections.map((section) => (
        <Collapsible key={section.id} defaultOpen className="border-t border-border">
          <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-sm font-medium hover:text-foreground transition-colors">
            <span>{section.name}</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pb-4">
            <div className="space-y-3">
              {section.options.map((option) => (
                <div key={option.value} className="flex items-center gap-3">
                  <Checkbox
                    id={`mobile-${section.id}-${option.value}`}
                    checked={selectedFilters[section.id].includes(option.value)}
                    onCheckedChange={() => toggleFilter(section.id, option.value)}
                    className="rounded border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-4 w-4 shrink-0"
                  />
                  <Label
                    htmlFor={`mobile-${section.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer text-muted-foreground flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Price Range */}
      <div className="border-t border-border py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Price</span>
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} — ${priceRange[1]}
          </span>
        </div>
        <Slider min={0} max={100} step={5} value={priceRange} onValueChange={setPriceRange} className="py-2" />
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full rounded-full bg-transparent mt-4">
          Clear all filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-4">Browse Vinyl</h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of vinyl records from sellers around the world.
            </p>
          </div>
        </div>

        <section className="border-b border-border/40 bg-background sticky top-14 sm:top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Sort dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-sm font-medium">
                    Sort
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={sortBy === option.value ? "bg-muted" : ""}
                    >
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="sm:hidden gap-2 text-sm font-medium">
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-6">
                  <SheetHeader className="pb-4 border-b">
                    <SheetTitle className="text-lg font-medium text-left">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 overflow-y-auto h-[calc(100%-80px)]">
                    <MobileFilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop filter popovers */}
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                {filterSections.map((section) => (
                  <Popover key={section.id}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="gap-2 text-sm font-medium">
                        {section.name}
                        {selectedFilters[section.id].length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs rounded-sm">
                            {selectedFilters[section.id].length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-56 p-4">
                      <div className="space-y-3">
                        {section.options.map((option) => (
                          <div key={option.value} className="flex items-center gap-3">
                            <Checkbox
                              id={`desktop-${section.id}-${option.value}`}
                              checked={selectedFilters[section.id].includes(option.value)}
                              onCheckedChange={() => toggleFilter(section.id, option.value)}
                              className="rounded border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground h-4 w-4 shrink-0"
                            />
                            <Label
                              htmlFor={`desktop-${section.id}-${option.value}`}
                              className="text-sm font-medium whitespace-nowrap cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}

                {/* Price filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-sm font-medium">
                      Price
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Price Range</span>
                        <span className="text-sm text-muted-foreground">
                          ${priceRange[0]} — ${priceRange[1]}
                        </span>
                      </div>
                      <Slider min={0} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Active Filters */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {Object.entries(selectedFilters).map(([sectionId, values]) =>
                  values.map((value) => (
                    <Badge
                      key={`${sectionId}-${value}`}
                      variant="secondary"
                      className="gap-1 pl-3 pr-2 py-1.5 cursor-pointer hover:bg-secondary/80 capitalize"
                      onClick={() => toggleFilter(sectionId, value)}
                    >
                      {value.replace("-", " ")}
                      <X className="h-3 w-3" />
                    </Badge>
                  )),
                )}
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
                  Clear all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredVinyls.length} {filteredVinyls.length === 1 ? "record" : "records"}
            </p>
          </div>

          {/* Product Grid */}
          {filteredVinyls.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredVinyls.map((vinyl, index) => (
                <motion.div
                  key={vinyl.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <VinylCard vinyl={vinyl} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No records found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm mx-auto">
                Try adjusting your filters to find what you're looking for.
              </p>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  )
}
