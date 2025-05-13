"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Category =
  'T-shirt/top' | 'Trouser' | 'Pullover' | 'Dress' | 'Coat' |
  'Sandal' | 'Shirt' | 'Sneaker' | 'Bag' | 'Ankle boot'

// Keep the full list of categories for mapping purposes
export const allCategories: Category[] = [
  'T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
  'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'
] as const

// Update the interface to work with numeric IDs and accept an array of category IDs
interface CategorySelectProps {
  value: number | null
  onChange: (value: number) => void
  categories?: number[]
  placeholder?: string
}

// Mapping between category names and IDs (remains the same)
export const categoryMapping = allCategories.reduce(
  (acc, category, index) => {
    acc[index] = category
    return acc
  },
  {} as Record<number, Category>,
)

export const categoryIdMapping = allCategories.reduce(
  (acc, category, index) => {
    acc[category] = index
    return acc
  },
  {} as Record<Category, number>,
)

export function CategorySelect({ value, onChange, categories, placeholder = "Select a category" }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const selectedCategoryName = value || value === 0 ? categoryMapping[value] : null

  // Filter the allCategories based on the provided categories prop (array of IDs)
  const displayCategories = categories ? allCategories.filter(categoryName =>
    categories.includes(categoryIdMapping[categoryName])
  ) : allCategories;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCategoryName || placeholder} {/* Use selectedCategoryName and placeholder */}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} /> {/* Update placeholder in input */}
          <CommandList>
            <CommandEmpty>No matching category found.</CommandEmpty> {/* Update empty message */}
            <CommandGroup>
              {/* Iterate over the filtered displayCategories */}
              {displayCategories.map((categoryName) => {
                const categoryId = categoryIdMapping[categoryName];
                // Ensure categoryId exists (should always with our logic)
                if (categoryId === undefined) return null;

                return (
                  <CommandItem
                    key={categoryId}
                    value={categoryName} // Use category name for search value
                    onSelect={() => {
                      onChange(categoryId)
                      setOpen(false)
                    }}
                  >
                    {categoryName}
                    <Check className={cn("ml-auto h-4 w-4", value === categoryId ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
