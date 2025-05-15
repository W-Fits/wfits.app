"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter, X, Calendar, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { OutfitWithItems } from "@/components/wardrobe/outfit"
import { OutfitGridItem } from "@/components/wardrobe/outfit-grid-item"

export function OutfitGrid({
  outfits,
}: {
  outfits: OutfitWithItems[]
}) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null)
  const [minItems, setMinItems] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Apply filters to outfits
  const filteredOutfits = useMemo(() => {
    return outfits.filter((outfit) => {
      // Filter by minimum number of items
      if (minItems && outfit.outfit_items.length < minItems) {
        return false
      }

      return true
    })
  }, [outfits, selectedSeason, selectedOccasion, minItems])

  // Count active filters
  const activeFilterCount = [
    selectedSeason && selectedSeason !== "all" ? selectedSeason : null,
    selectedOccasion && selectedOccasion !== "all" ? selectedOccasion : null,
    minItems ? `${minItems}+ items` : null,
  ].filter(Boolean).length

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedSeason(null)
    setSelectedOccasion(null)
    setMinItems(null)
  }

  // Item count options
  const itemCountOptions = [2, 3, 4, 5]

  return (
    <div className="container mx-auto px-0">
      <div className="flex flex-col gap-6">
        {/* Search and filter controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search outfits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={resetFilters} size="sm">
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Active filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSeason && selectedSeason !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Season: {selectedSeason}
                  <button onClick={() => setSelectedSeason(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedOccasion && selectedOccasion !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3 mr-1" />
                  Occasion: {selectedOccasion}
                  <button onClick={() => setSelectedOccasion(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {minItems && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min items: {minItems}+
                  <button onClick={() => setMinItems(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <Accordion type="multiple" defaultValue={["season"]} className="w-full">
                <AccordionItem value="items">
                  <AccordionTrigger className="py-2">Minimum Items</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={minItems === null ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setMinItems(null)}
                      >
                        Any
                      </Button>
                      {itemCountOptions.map((count) => (
                        <Button
                          key={count}
                          variant={minItems === count ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setMinItems(count)}
                        >
                          {count}+
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredOutfits.length} of {outfits.length} outfits
        </div>

        {/* Outfits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOutfits.length > 0 ? (
            filteredOutfits.map((outfit) => (
              <Link href={`/wardrobe/outfits/${outfit.outfit_id}`} key={outfit.outfit_id} className="block h-full">
                <OutfitGridItem outfit={outfit} className="h-full" />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No outfits found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Loading skeleton for reference (not used in actual component) */}
        {false && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-md border">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
