import Image from "next/image";
import { OutfitWithItems } from "./outfit"

export function SmallOutfit({
  outfit
}: {
  outfit: OutfitWithItems;
}) {
  return (
    <div className="p-2 rounded-lg bg-muted w-fit">
      <div className="bg-background w-20 grid grid-cols-2 grid-rows-2 gap-1 p-1 rounded-md">
        {outfit.outfit_items.slice(0, 4).map((item) => (
          <Image
            key={item.item_id}
            src={item.item_url}
            alt={item.item_name}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        ))}
      </div>
      Outfit {outfit.outfit_id}
    </div>
  );
}
