"use client"

import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export const sizes = ["xs", "s", "m", "l", "xl"] as const

export type Size = (typeof sizes)[number]

interface SizeSelectProps {
  value: Size | null
  onChange: (value: Size) => void
}

export function SizeSelect({ value, onChange }: SizeSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? value.toUpperCase() : "Select size"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {sizes.map((size) => (
                <CommandItem
                  key={size}
                  value={size}
                  onSelect={() => {
                    onChange(size)
                    setOpen(false)
                  }}
                >
                  {size.toUpperCase()}
                  <Check className={cn("ml-auto h-4 w-4", value === size ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

