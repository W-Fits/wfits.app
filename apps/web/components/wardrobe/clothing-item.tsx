import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ClothingClass } from "@/components/shared/clothing-class-select"
import { Colour } from "@/components/shared/colour-select"
import { Size } from "@/components/shared/size-select"
import { EnvironmentEnum } from "@prisma/client"

export interface ClothingItemProps {
  src: string
  alt: string
  name?: string
  category?: ClothingClass
  size?: Size
  colour?: Colour
  isWaterproof?: boolean
  environment?: EnvironmentEnum
  className?: string

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
}: ClothingItemProps) {
  return (
    <div className={cn("relative group overflow-hidden rounded-lg", className)}>
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {showName && name && <h3 className="mt-3 text-lg font-medium">{name}</h3>}

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
  )
}