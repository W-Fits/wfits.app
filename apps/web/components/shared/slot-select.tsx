"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const slots = {
  0: ["Bag"],
  1: ["Sandal", "Sneaker", "Ankle boot"],
  2: ["Trouser"],
  3: ["T-shirt/top", "Pullover", "Dress", "Coat", "Shirt"],
} as const

interface SlotSelectProps {
  slotNumber: keyof typeof slots
  value: string | undefined
  onChange: (value: string) => void
}

export function SlotSelect({ slotNumber, value, onChange }: SlotSelectProps) {
  const [open, setOpen] = useState(false)
  const options = slots[slotNumber]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value || `Select slot ${slotNumber} item`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search slot ${slotNumber} items...`} />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                >
                  {item}
                  <Check className={cn("ml-auto h-4 w-4", value === item ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

