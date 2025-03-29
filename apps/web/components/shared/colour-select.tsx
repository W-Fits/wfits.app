"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Colour {
  name: string
  value: string
}

export const colours: Colour[] = [
  {
    name: "slate",
    value: "#cbd5e1",
  },
  {
    name: "gray",
    value: "#9ca3af",
  },
  {
    name: "zinc",
    value: "#71717a",
  },
  {
    name: "neutral",
    value: "#52525b",
  },
  {
    name: "stone",
    value: "#504640",
  },
  {
    name: "red",
    value: "#ef4444",
  },
  {
    name: "orange",
    value: "#f97316",
  },
  {
    name: "amber",
    value: "#f59e0b",
  },
  {
    name: "yellow",
    value: "#eab308",
  },
  {
    name: "lime",
    value: "#84cc16",
  },
  {
    name: "green",
    value: "#22c55e",
  },
  {
    name: "emerald",
    value: "#10b981",
  },
  {
    name: "teal",
    value: "#14b8a6",
  },
  {
    name: "cyan",
    value: "#06b6d4",
  },
  {
    name: "sky",
    value: "#0ea5e9",
  },
  {
    name: "blue",
    value: "#3b82f6",
  },
  {
    name: "indigo",
    value: "#6366f1",
  },
  {
    name: "violet",
    value: "#8b5cf6",
  },
  {
    name: "purple",
    value: "#a855f7",
  },
  {
    name: "fuchsia",
    value: "#d946ef",
  },
  {
    name: "pink",
    value: "#ec4899",
  },
  {
    name: "rose",
    value: "#f472b6",
  },
]

// Update the interface to work with numeric IDs
interface ColorSelectProps {
  value: number | null
  onChange: (value: number) => void
}

// Add a mapping between colour objects and IDs
export const colourMapping = colours.reduce(
  (acc, colour, index) => {
    acc[index + 1] = colour
    return acc
  },
  {} as Record<number, Colour>,
)

export const colourIdMapping = colours.reduce(
  (acc, colour, index) => {
    acc[colour.name] = index + 1
    return acc
  },
  {} as Record<string, number>,
)

export function ColourSelect({ value, onChange }: ColorSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedColour = value ? colourMapping[value] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedColour ? (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: selectedColour.value }}
                aria-hidden="true"
              />
              <span>{selectedColour.name}</span>
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
              {colours.map((color, index) => {
                const colourId = index + 1
                return (
                  <CommandItem
                    key={color.name}
                    value={color.name}
                    onSelect={() => {
                      onChange(colourId)
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
                    <Check className={cn("ml-auto h-4 w-4", value === colourId ? "opacity-100" : "opacity-0")} />
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

