"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Snowflake, Thermometer } from "lucide-react"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { EnvironmentEnum } from "@prisma/client"

export const environments = ["Warm", "Cold"] as const;

interface EnvironmentSelectProps {
  value: EnvironmentEnum | null
  onChange: (value: EnvironmentEnum) => void
}

export function EnvironmentSelect({ value, onChange }: EnvironmentSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <div className="flex items-center gap-2">
              {value === "Warm" ? (
                <Thermometer className="h-4 w-4 text-orange-500" />
              ) : (
                <Snowflake className="h-4 w-4 text-blue-500" />
              )}
              <span>{value}</span>
            </div>
          ) : (
            "Select environment"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandGroup>
            <CommandList>
              {environments.map((env) => (
                <CommandItem
                  key={env}
                  value={env}
                  onSelect={() => {
                    onChange(env)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    {env === "Warm" ? (
                      <Thermometer className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Snowflake className="h-4 w-4 text-blue-500" />
                    )}
                    <span>{env}</span>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === env ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

