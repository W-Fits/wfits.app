import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import type { OutfitWithItems } from "@/components/wardrobe/outfit"

interface OutfitItemProps {
  outfit: OutfitWithItems
  className?: string
}

export function OutfitGridItem({ outfit, className }: OutfitItemProps) {
  // Get up to 4 items to display in the preview
  const previewItems = outfit.outfit_items.slice(0, 4)

  // Calculate the number of additional items not shown in preview
  const additionalItems = Math.max(0, outfit.outfit_items.length - 4)

  // Get the first item with an image to use as the main preview
  const mainPreviewItem = outfit.outfit_items.find((item) => item.item.item_url)?.item

  // Format date
  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border bg-card transition-all hover:shadow-md",
        className,
      )}
    >
      {/* Main preview area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* Main preview image */}
        {mainPreviewItem?.item_url ? (
          <Image
            src={mainPreviewItem.item_url || "/placeholder.svg"}
            alt={"Outfit"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No preview</span>
          </div>
        )}

        {/* Outfit item count badge */}
        <div className="absolute left-2 top-2">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
            {outfit.outfit_items.length} {outfit.outfit_items.length === 1 ? "item" : "items"}
          </Badge>
        </div>

        {/* Item thumbnails overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex -space-x-2">
            {previewItems.map((outfitItem) => (
              <div
                key={outfitItem.item_id}
                className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white"
              >
                {outfitItem.item.item_url ? (
                  <Image
                    src={outfitItem.item.item_url || "/placeholder.svg"}
                    alt={outfitItem.item.item_name || "Item"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
            ))}
            {additionalItems > 0 && (
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black/60 text-xs text-white">
                +{additionalItems}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outfit details */}
      <div className="flex flex-col p-3">
        <h3 className="line-clamp-1 font-medium">{"Outfit" + outfit.outfit_id || "Unnamed Outfit"}</h3>

        {/* Attributes */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {outfit.created_at && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-none bg-muted px-2 py-0 text-xs font-normal"
            >
              <Clock className="h-3 w-3" />
              {formatDate(outfit.created_at)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
