"use client";

import type { Item, Outfit } from "@prisma/client";
import { OutfitItem } from "./outfit-item";
import { useEffect, useRef } from "react";
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
  outfit_items: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[];
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

function sortItemsByCategory(
  outfitItems: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[]
): {
  item_id: number;
  outfit_id: number;
  item: ExtendedItem;
}[] {
  return [...outfitItems].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.item.category_tag.category_name);
    const indexB = categoryOrder.indexOf(b.item.category_tag.category_name);

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
  edit,
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

  const initialOutfitItemsRef = useRef(
    JSON.stringify(initialOutfit.outfit_items)
  );

  useEffect(() => {
    if (!outfit) return;

    if (!initialOutfit) return setOutfit(null);

    const currentOutfitItemsString = JSON.stringify(outfit.outfit_items);

    if (initialOutfitItemsRef.current !== currentOutfitItemsString) {
      setOutfit((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          outfit_items: sortItemsByCategory(prev.outfit_items),
        };
      });
      initialOutfitItemsRef.current = currentOutfitItemsString;
    }
  }, [initialOutfit, setOutfit, outfit]);

  const handleSelectItem = (oldItem: ExtendedItem, newItem: ExtendedItem) => {
    if (!outfit) return;

    const updatedOutfitItems = [
      ...outfit.outfit_items.filter(
        (item) => item.item.item_id !== oldItem.item_id
      ),
      { item_id: newItem.item_id, outfit_id: outfit.outfit_id, item: newItem },
    ];

    const sortedOutfitItems = sortItemsByCategory(updatedOutfitItems);

    setOutfit({
      ...outfit,
      outfit_items: sortedOutfitItems,
    });
  };

  return (
    <div className="">
      {outfit &&
        outfit.outfit_items.length !== 0 &&
        outfit.outfit_items.map((outfit_item) => (
          <OutfitItem
            key={outfit_item.item.item_id}
            item={outfit_item.item}
            categoryName={outfit_item.item.category_tag.category_name}
            onSelectItem={(newItem) => handleSelectItem(outfit_item.item, newItem)}
          />
        ))}
    </div>
  );
}
