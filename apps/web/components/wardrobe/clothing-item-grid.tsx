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
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ExtendedItem extends Item {
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
      if (selectedCategory && item.category_tag.category_name !== selectedCategory) {
        return false
      }

      // Filter by size
      if (selectedSize && item.size_tag.size_name !== selectedSize) {
        return false
      }

      // Filter by colour
      if (selectedColour && item.colour_tag.colour_name !== selectedColour) {
        return false
      }

      // Filter by waterproof
      if (waterproofOnly && !item.waterproof) {
        return false
      }

      // Filter by environment
      if (selectedEnvironment && item.environment !== selectedEnvironment) {
        return false
      }

      return true
    })
  }, [items, searchQuery, selectedCategory, selectedSize, selectedColour, waterproofOnly, selectedEnvironment])

  // Count active filters
  const activeFilterCount = [
    selectedCategory,
    selectedSize,
    selectedColour,
    waterproofOnly ? "waterproof" : null,
    selectedEnvironment,
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
    <div className="container mx-auto px-4 pt-6 pb-24">
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
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
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

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <Accordion type="single" collapsible defaultValue="category" className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <Select
                      value={selectedCategory || ""}
                      onValueChange={(value) => setSelectedCategory(value || null)}
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
                  <AccordionTrigger>Size</AccordionTrigger>
                  <AccordionContent>
                    <Select value={selectedSize || ""} onValueChange={(value) => setSelectedSize(value || null)}>
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
                  <AccordionTrigger>Colour</AccordionTrigger>
                  <AccordionContent>
                    <Select value={selectedColour || ""} onValueChange={(value) => setSelectedColour(value || null)}>
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
                  <AccordionTrigger>Properties</AccordionTrigger>
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
                            onValueChange={(value) => setSelectedEnvironment(value || null)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link href={`/wardrobe/clothes/item/${item.item_id}`} key={item.item_id}>
                <ClothingItem
                  src={item.item_url}
                  alt={item.item_name}
                  name={item.item_name}
                  category={item.category_tag.category_name as Category}
                  size={item.size_tag.size_name as Size}
                  colour={{ name: item.colour_tag.colour_name, value: item.colour_tag.colour_value } as Colour}
                  isWaterproof={item.waterproof ?? undefined}
                  environment={item.environment ?? undefined}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No items found matching your filters. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}