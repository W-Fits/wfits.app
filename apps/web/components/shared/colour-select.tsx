"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const colours = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Grey", value: "#808080" },
  { name: "Navy", value: "#000080" },
  { name: "Beige", value: "#F5F5DC" },
  { name: "Brown", value: "#8B4513" },
  { name: "Red", value: "#FF0000" },
  { name: "Pink", value: "#FFC0CB" },
  { name: "Orange", value: "#FFA500" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Green", value: "#008000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Purple", value: "#800080" },
  { name: "Cream", value: "#FFFDD0" },
  { name: "Khaki", value: "#C3B091" },
  { name: "Teal", value: "#008080" },
  { name: "Mustard", value: "#FFDB58" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Olive", value: "#808000" },
  { name: "Maroon", value: "#800000" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Magenta", value: "#FF00FF" },
]

export type Colour = (typeof colours)[number]

interface ColorSelectProps {
  value: Colour | null
  onChange: (value: Colour) => void
}

export function ColourSelect({ value, onChange }: ColorSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: value.value }}
                aria-hidden="true"
              />
              <span>{value.name}</span>
            </div>
          ) : (
            "Select color"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search color..." />
          <CommandList>
            <CommandEmpty>No color found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {colours.map((color) => (
                <CommandItem
                  key={color.name}
                  value={color.name}
                  onSelect={() => {
                    onChange(color)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                      aria-hidden="true"
                    />
                    <span>{color.name}</span>
                  </div>
                  <Check
                    className={cn("ml-auto h-4 w-4", value?.value === color.value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

