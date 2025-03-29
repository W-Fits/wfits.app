"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"
import { Command, CommandGroup, CommandList, CommandItem } from "@/components/ui/command"

export type Size = "sm" | "md" | "lg" | "xl"

export const sizes: Size[] = ["sm", "md", "lg", "xl"]

// Update the interface to work with numeric IDs
interface SizeSelectProps {
  value: number | null
  onChange: (value: number) => void
}

// Add a mapping between size strings and IDs
export const sizeMapping = sizes.reduce(
  (acc, size, index) => {
    acc[index + 1] = size
    return acc
  },
  {} as Record<number, Size>,
)

export const sizeIdMapping = sizes.reduce(
  (acc, size, index) => {
    acc[size] = index + 1
    return acc
  },
  {} as Record<Size, number>,
)

export function SizeSelect({ value, onChange }: SizeSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedSize = value ? sizeMapping[value] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedSize ? selectedSize.toUpperCase() : "Select size"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {sizes.map((size, index) => {
                const sizeId = index + 1
                return (
                  <CommandItem
                    key={size}
                    value={size}
                    onSelect={() => {
                      onChange(sizeId)
                      setOpen(false)
                    }}
                  >
                    {size.toUpperCase()}
                    <Check className={cn("ml-auto h-4 w-4", value === sizeId ? "opacity-100" : "opacity-0")} />
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

