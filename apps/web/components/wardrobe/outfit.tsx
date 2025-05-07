"use client"

import type { Item, Outfit } from "@prisma/client"
import { OutfitItem } from "./outfit-item"
import { Fragment, useEffect, useState } from "react"
import { useOptionalState } from "@/lib/hooks/use-optional-state"
import { FolderIcon as Hanger } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExtendedItem extends Item {
  category_tag: {
    category_id: number
    category_name: string
  }
  colour_tag: {
    colour_id: number
    colour_name: string
    colour_value: string
  }
  size_tag: {
    size_id: number
    size_name: string
  }
}

export interface OutfitWithItems extends Outfit {
  outfit_items: {
    item_id: number
    outfit_id: number
    item: ExtendedItem
  }[]
}

export interface DisplayOutfit {
  [key: string]: {
    item_id: number
    outfit_id: number
    item: ExtendedItem
  }[]
}

function getDisplayOutfit(outfit: OutfitWithItems) {
  const displayOutfit: DisplayOutfit = {
    "Coat": [],
    "Pullover": [],
    "Shirt": [],
    "T-shirt/top": [],
    "Trouser": [],
    "Sandal": [],
    "Sneaker": [],
    "Ankle boot": [],
    "Bag": []
  }

  outfit.outfit_items.forEach((outfit_item) => {
    const categoryName = outfit_item.item.category_tag.category_name
    if (displayOutfit[categoryName]) {
      displayOutfit[categoryName].push(outfit_item)
    }
  });

  return displayOutfit;
}

export function Outfit({
  initialOutfit,
  edit = false,
  outfit: outfitProp,
  setOutfit: setOutfitProp,
  className
}: {
  initialOutfit: OutfitWithItems
  edit?: boolean
  outfit?: OutfitWithItems | null
  setOutfit?: React.Dispatch<React.SetStateAction<OutfitWithItems | null>>
  className?: string
}) {
  const [outfit, setOutfit] = useOptionalState({
    initialValue: initialOutfit,
    value: outfitProp,
    setValue: setOutfitProp,
  });

  const [displayOutfit, setDisplayOutfit] = useState<DisplayOutfit>({
    "Coat": [],
    "Pullover": [],
    "Shirt": [],
    "T-shirt/Top": [],
    "Trouser": [],
    "Sandal": [],
    "Sneaker": [],
    "Ankle boot": [],
    "Bag": [],
  });

  useEffect(() => {
    if (!outfit) return;

    if (!initialOutfit) return setOutfit(null);

    setDisplayOutfit(getDisplayOutfit(outfit));

  }, [initialOutfit, setOutfit, outfit]);

  const handleSelectItem = (oldItem: ExtendedItem, newItem: ExtendedItem) => {
    if (!outfit) return;

    const updatedOutfitItems = [
      ...outfit.outfit_items.filter((item) => item.item.item_id !== oldItem.item_id),
      { item_id: newItem.item_id, outfit_id: outfit.outfit_id, item: newItem },
    ];

    setOutfit((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        outfit_items: updatedOutfitItems,
      }
    });

    setDisplayOutfit(getDisplayOutfit(outfit));
  }

  if (!outfit || outfit.outfit_items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed rounded-lg bg-muted/20">
        <Hanger className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No items in this outfit</h3>
        <p className="text-sm text-muted-foreground mt-1">Add items to create your outfit</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{outfit.outfit_name}</h1>
        <div className="text-sm text-muted-foreground">{outfit.outfit_items.length} items</div>
      </div>
      <div className="grid gap-4">
        {Object.keys(displayOutfit).map((category) => (
          <Fragment key={category}>
            {displayOutfit[category].map((outfit_item) => (
              <OutfitItem
                key={outfit_item.item.item_id}
                className="mx-auto w-3/4"
                item={outfit_item.item}
                categoryName={outfit_item.item.category_tag.category_name}
                onSelectItem={(newItem) => handleSelectItem(outfit_item.item, newItem)}
                edit={edit}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}