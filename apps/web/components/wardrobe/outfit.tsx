"use client"

import type { Category } from "@/components/shared/category-select"
import type { Item } from "@prisma/client"
import { OutfitItem } from "./outfit-item"

export type DisplayOutfit = {
  [k in Category]?: Item
}

export function Outfit({
  outfit,
  setOutfit,
  edit = false,
}: {
  outfit: DisplayOutfit
  setOutfit: (outfit: DisplayOutfit) => void
  edit: boolean
}) {
  const handleSelectItem = (category: Category, newItem: Item) => {
    setOutfit({
      ...outfit,
      [category]: newItem,
    })
  }

  return (
    <div className="">
      {outfit["Coat"] && (
        <OutfitItem
          item={outfit["Coat"]}
          categoryName="Coat"
          onSelectItem={(newItem) => handleSelectItem("Coat", newItem)}
        />
      )}
      {outfit["Pullover"] && (
        <OutfitItem
          item={outfit["Pullover"]}
          categoryName="Pullover"
          onSelectItem={(newItem) => handleSelectItem("Pullover", newItem)}
        />
      )}
      {outfit["T-shirt/top"] && (
        <OutfitItem
          item={outfit["T-shirt/top"]}
          categoryName="T-shirt/top"
          onSelectItem={(newItem) => handleSelectItem("T-shirt/top", newItem)}
        />
      )}
      {outfit["Shirt"] && (
        <OutfitItem
          item={outfit["Shirt"]}
          categoryName="Shirt"
          onSelectItem={(newItem) => handleSelectItem("Shirt", newItem)}
        />
      )}
      {outfit["Trouser"] && (
        <OutfitItem
          item={outfit["Trouser"]}
          categoryName="Trouser"
          onSelectItem={(newItem) => handleSelectItem("Trouser", newItem)}
        />
      )}
      {outfit["Sandal"] && (
        <OutfitItem
          item={outfit["Sandal"]}
          categoryName="Sandal"
          onSelectItem={(newItem) => handleSelectItem("Sandal", newItem)}
        />
      )}
      {outfit["Sneaker"] && (
        <OutfitItem
          item={outfit["Sneaker"]}
          categoryName="Sneaker"
          onSelectItem={(newItem) => handleSelectItem("Sneaker", newItem)}
        />
      )}
      {outfit["Ankle boot"] && (
        <OutfitItem
          item={outfit["Ankle boot"]}
          categoryName="Ankle boot"
          onSelectItem={(newItem) => handleSelectItem("Ankle boot", newItem)}
        />
      )}
    </div>
  )
}
