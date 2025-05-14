"use client"

import type { Item } from "@prisma/client"
import { useState, useMemo } from "react"
import { ClothingItem } from "@/components/wardrobe/clothing-item"
import type { Size } from "@/components/shared/size-select"
import type { Category } from "@/components/shared/category-select"
import type { Colour } from "@/components/shared/colour-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export interface ExtendedItem extends Item {
  category_tag: {
    category_id: number
    category_name: string
  }
  size_tag: {
    size_id: number
    size_name: string
  }
  colour_tag: {
    colour_id: number
    colour_name: string
    colour_value: string
  }
}

export function ClothingItemGrid({
  items,
}: {
  items: ExtendedItem[]
}) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColour, setSelectedColour] = useState<string | null>(null)
  const [waterproofOnly, setWaterproofOnly] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique values for filter options
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category_tag.category_name))), [items])

  const sizes = useMemo(() => Array.from(new Set(items.map((item) => item.size_tag.size_name))), [items])

  const colours = useMemo(() => Array.from(new Set(items.map((item) => item.colour_tag.colour_name))), [items])

  const environments = useMemo(
    () => Array.from(new Set(items.map((item) => item.environment).filter(Boolean))),
    [items],
  )

  // Apply filters to items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search by name
      if (searchQuery && !item.item_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filter by category
      if (selectedCategory && selectedCategory !== "all" && item.category_tag.category_name !== selectedCategory) {
        return false
      }

      // Filter by size
      if (selectedSize && selectedSize !== "all" && item.size_tag.size_name !== selectedSize) {
        return false
      }

      // Filter by colour
      if (selectedColour && selectedColour !== "all" && item.colour_tag.colour_name !== selectedColour) {
        return false
      }

      // Filter by waterproof
      if (waterproofOnly && !item.waterproof) {
        return false
      }

      // Filter by environment
      if (selectedEnvironment && selectedEnvironment !== "all" && item.environment !== selectedEnvironment) {
        return false
      }

      return true
    })
  }, [items, searchQuery, selectedCategory, selectedSize, selectedColour, waterproofOnly, selectedEnvironment])

  // Count active filters
  const activeFilterCount = [
    selectedCategory && selectedCategory !== "all" ? selectedCategory : null,
    selectedSize && selectedSize !== "all" ? selectedSize : null,
    selectedColour && selectedColour !== "all" ? selectedColour : null,
    waterproofOnly ? "waterproof" : null,
    selectedEnvironment && selectedEnvironment !== "all" ? selectedEnvironment : null,
  ].filter(Boolean).length

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedSize(null)
    setSelectedColour(null)
    setWaterproofOnly(false)
    setSelectedEnvironment(null)
  }

  return (
    <div className="container mx-auto px-0">
      <div className="flex flex-col gap-6">
        {/* Search and filter controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search items..."
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
              {selectedCategory && selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedSize && selectedSize !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedColour && selectedColour !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Colour: {selectedColour}
                  <button onClick={() => setSelectedColour(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {waterproofOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Waterproof
                  <button onClick={() => setWaterproofOnly(false)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedEnvironment && selectedEnvironment !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Environment: {selectedEnvironment}
                  <button onClick={() => setSelectedEnvironment(null)} className="ml-1 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <Accordion type="multiple" defaultValue={["category"]} className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger className="py-2">Category</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={selectedCategory || ""}
                      onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="size">
                  <AccordionTrigger className="py-2">Size</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={selectedSize || ""}
                      onValueChange={(value) => setSelectedSize(value === "all" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sizes</SelectItem>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="colour">
                  <AccordionTrigger className="py-2">Colour</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={selectedColour || ""}
                      onValueChange={(value) => setSelectedColour(value === "all" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select colour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All colours</SelectItem>
                        {colours.map((colour) => (
                          <SelectItem key={colour} value={colour}>
                            {colour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="properties">
                  <AccordionTrigger className="py-2">Properties</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waterproof"
                          checked={waterproofOnly}
                          onCheckedChange={(checked) => setWaterproofOnly(checked === true)}
                        />
                        <Label htmlFor="waterproof">Waterproof only</Label>
                      </div>

                      {environments.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="environment">Environment</Label>
                          <Select
                            value={selectedEnvironment || ""}
                            onValueChange={(value) => setSelectedEnvironment(value === "all" ? null : value)}
                          >
                            <SelectTrigger id="environment">
                              <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All environments</SelectItem>
                              {environments.map((env) => (
                                <SelectItem key={env as string} value={env as string}>
                                  {env as string}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} items
        </div>

        {/* Clothing items grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link href={`/wardrobe/clothes/item/${item.item_id}`} key={item.item_id} className="block h-full">
                <ClothingItem
                  src={item.item_url}
                  alt={item.item_name}
                  name={item.item_name}
                  category={item.category_tag.category_name as Category}
                  size={item.size_tag.size_name as Size}
                  colour={{ name: item.colour_tag.colour_name, value: item.colour_tag.colour_value } as Colour}
                  isWaterproof={item.waterproof ?? undefined}
                  environment={item.environment ?? undefined}
                  className="h-full"
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No items found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Button onClick={resetFilters} variant="outline" className="mt-4">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Loading skeleton for reference (not used in actual component) */}
        {false && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-md border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
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
