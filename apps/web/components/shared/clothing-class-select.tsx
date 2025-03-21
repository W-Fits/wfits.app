"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const clothingClass = [
  "T-shirt/top",
  "Trouser",
  "Pullover",
  "Dress",
  "Coat",
  "Sandal",
  "Shirt",
  "Sneaker",
  "Bag",
  "Ankle boot",
] as const

export const slots = [
  ["Bag"],
  ["Sandal", "Sneaker", "Ankle boot"],
  ["Trouser"],
  ["T-shirt/top", "Pullover", "Dress", "Coat", "Shirt"],
]

export type ClothingClass = (typeof clothingClass)[number]

interface ClothingClassSelectProps {
  value: ClothingClass | null
  onChange: (value: ClothingClass) => void
}

export function ClothingClassSelect({ value, onChange }: ClothingClassSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value || "Select clothing type"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search clothing type..." />
          <CommandList>
            <CommandEmpty>No clothing type found.</CommandEmpty>
            <CommandGroup>
              {clothingClass.map((type) => (
                <CommandItem
                  key={type}
                  value={type}
                  onSelect={() => {
                    onChange(type)
                    setOpen(false)
                  }}
                >
                  {type}
                  <Check className={cn("ml-auto h-4 w-4", value === type ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

