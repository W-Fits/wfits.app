"use client"

import type { Item, Outfit } from "@prisma/client"
import { OutfitItem } from "./outfit-item"
import { useEffect, useState } from "react";
import { useOptionalState } from "@/lib/hooks/use-optional-state";

export interface ExtendedItem extends Item {
  category_tag: {
    category_id: number;
    category_name: string;
  };
  colour_tag: {
    colour_id: number;
    colour_name: string;
    colour_value: string;
  };
  size_tag: {
    size_id: number;
    size_name: string;
  };
}

export interface OutfitWithItems extends Outfit {
  outfit_items: ExtendedItem[]
}

const categoryOrder = [
  "Coat",
  "Pullover",
  "Shirt",
  "T-shirt/Top",
  "Trouser",
  "Sandal",
  "Sneaker",
  "Ankle boot",
];

function sortItemsByCategory(items: ExtendedItem[]): ExtendedItem[] {
  return [...items].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category_tag.category_name);
    const indexB = categoryOrder.indexOf(b.category_tag.category_name);

    if (indexA === -1 && indexB === -1) {
      return 0;
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    }

    return indexA - indexB;
  });
}


export function Outfit({
  initialOutfit,
  edit = false,
  outfit: outfitProp,
  setOutfit: setOutfitProp,
}: {
  initialOutfit: OutfitWithItems;
  edit?: boolean;
  outfit?: OutfitWithItems | null;
  setOutfit?: React.Dispatch<React.SetStateAction<OutfitWithItems | null>>;
}) {
  const [outfit, setOutfit] = useOptionalState({
    initialValue: initialOutfit,
    value: outfitProp,
    setValue: setOutfitProp,
  });

  useEffect(() => {
    if (!outfit) return;

    if (!initialOutfit) return setOutfit(null);

    setOutfit((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        outfit_items: sortItemsByCategory(prev.outfit_items)
      }
    });
  }, [initialOutfit]);

  const handleSelectItem = (oldItem: ExtendedItem, newItem: ExtendedItem) => {
    if (!outfit) return;
    setOutfit({
      ...outfit,
      outfit_items: [...outfit.outfit_items.filter((item) => item.item_id !== oldItem.item_id), newItem],
    });
  }

  return (
    <div className="">
      {outfit && outfit.outfit_items.map((item) => (
        <OutfitItem
          key={item.item_id}
          item={item}
          categoryName={item.category_tag.category_name}
          onSelectItem={(newItem) => handleSelectItem(item, newItem)}
        />
      ))}
    </div>
  );
}
