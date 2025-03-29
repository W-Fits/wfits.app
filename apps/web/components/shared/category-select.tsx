"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Category =
  | "T-shirts"
  | "Shirts"
  | "Pants"
  | "Jeans"
  | "Shorts"
  | "Jackets"
  | "Coats"
  | "Sweaters"
  | "Hoodies"
  | "Suits"
  | "Blazers"
  | "Dresses"
  | "Skirts"
  | "Underwear"
  | "Socks"
  | "Swimwear"
  | "Loungewear"
  | "Activewear"
  | "Shoes"
  | "Accessories";

export const categories: Category[] = [
  "T-shirts",
  "Shirts",
  "Pants",
  "Jeans",
  "Shorts",
  "Jackets",
  "Coats",
  "Sweaters",
  "Hoodies",
  "Suits",
  "Blazers",
  "Dresses",
  "Skirts",
  "Underwear",
  "Socks",
  "Swimwear",
  "Loungewear",
  "Activewear",
  "Shoes",
  "Accessories",
] as const

// Update the interface to work with numeric IDs
interface CategorySelectProps {
  value: number | null
  onChange: (value: number) => void
}

// Add a mapping between category names and IDs
export const categoryMapping = categories.reduce(
  (acc, category, index) => {
    acc[index + 1] = category
    return acc
  },
  {} as Record<number, Category>,
)

export const categoryIdMapping = categories.reduce(
  (acc, category, index) => {
    acc[category] = index + 1
    return acc
  },
  {} as Record<Category, number>,
)

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const selectedCategory = value ? categoryMapping[value] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCategory || "Select clothing type"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search clothing type..." />
          <CommandList>
            <CommandEmpty>No clothing type found.</CommandEmpty>
            <CommandGroup>
              {categories.map((type, index) => {
                const categoryId = index + 1
                return (
                  <CommandItem
                    key={categoryId}
                    value={type}
                    onSelect={() => {
                      onChange(categoryId)
                      setOpen(false)
                    }}
                  >
                    {type}
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

