import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Category } from "@/components/shared/category-select"
import { Colour } from "@/components/shared/colour-select"
import { Size } from "@/components/shared/size-select"
import { EnvironmentEnum } from "@prisma/client"
import { ClothingImage } from "../shared/clothing-image"

export interface ClothingItemProps {
  src: string
  alt: string
  name?: string
  category?: Category
  size?: Size
  colour?: Colour
  isWaterproof?: boolean
  environment?: EnvironmentEnum
  className?: string
  outline?: boolean

  // Show/hide props
  showName?: boolean
  showCategory?: boolean
  showSize?: boolean
  showColour?: boolean
  showWaterproof?: boolean
  showEnvironment?: boolean
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
  showName = true,
  showCategory = true,
  showSize = true,
  showColour = true,
  showWaterproof = true,
  showEnvironment = true,
  outline = true
}: ClothingItemProps) {
  return (
    <div className={cn(
      "relative group overflow-hidden",
      outline && "border border-muted shadow-sm rounded-lg",
      className
    )}>
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <ClothingImage src={src} />
      </div>
      <div className="bg-muted px-4 py-2 mt-4">

        {showName && name && <h3 className="text-lg font-medium">{name}</h3>}

        <div className="flex flex-wrap gap-2 mt-2">
          {showCategory && category && (
            <Badge variant="outline" className="bg-primary/10">
              {category}
            </Badge>
          )}

          {showSize && size && (
            <Badge variant="outline" className="bg-secondary/10">
              Size: {size}
            </Badge>
          )}

          {showColour && colour && (
            <Badge variant="outline" className="bg-accent/10">
              {colour.name}
            </Badge>
          )}

          {showWaterproof && isWaterproof !== undefined && (
            <Badge variant={isWaterproof ? "default" : "outline"} className={isWaterproof ? "bg-blue-500" : ""}>
              {isWaterproof ? "Waterproof" : "Not Waterproof"}
            </Badge>
          )}

          {showEnvironment && environment && (
            <Badge variant="outline" className={environment === "Warm" ? "bg-orange-500/20" : "bg-blue-500/20"}>
              {environment}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}