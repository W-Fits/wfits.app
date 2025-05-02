import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Droplets, Palmtree, Mountain, MapIcon as City, Home, Sun, Snowflake } from "lucide-react"
import type { Size } from "@/components/shared/size-select"
import type { Category } from "@/components/shared/category-select"
import type { Colour } from "@/components/shared/colour-select"

interface ClothingItemProps {
  src?: string | null
  alt: string
  name: string
  category: Category
  size: Size
  colour: Colour
  isWaterproof?: boolean
  environment?: string
  className?: string
}

export function ClothingItem({
  src,
  alt,
  name,
  category,
  size,
  colour,
  isWaterproof,
  environment,
  className,
}: ClothingItemProps) {
  // Map environment to icon
  const getEnvironmentIcon = () => {
    switch (environment?.toLowerCase()) {
      case "Cold":
        return <Snowflake className="h-3 w-3" />
      case "Warm":
        return <Sun className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border bg-card transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}

        {/* Attribute badges - top right */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          {isWaterproof && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-blue-100/80 text-blue-700 backdrop-blur-sm dark:bg-blue-900/80 dark:text-blue-300"
            >
              <Droplets className="h-3 w-3" />
            </Badge>
          )}
          {environment && getEnvironmentIcon() && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-green-100/80 text-green-700 backdrop-blur-sm dark:bg-green-900/80 dark:text-green-300"
            >
              {getEnvironmentIcon()}
            </Badge>
          )}
        </div>
      </div>

      {/* Item details */}
      <div className="flex flex-col p-3">
        <h3 className="line-clamp-1 font-medium">{name}</h3>

        {/* Attributes row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-none bg-muted px-2 py-0 text-xs font-normal"
          >
            {category}
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-none bg-muted px-2 py-0 text-xs font-normal"
          >
            {size}
          </Badge>
          <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-muted">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: colour.value }} />
            {colour.name}
          </div>
        </div>
      </div>
    </div>
  )
}