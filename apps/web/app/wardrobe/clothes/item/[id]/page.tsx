import { ClothingItem } from "@/components/wardrobe/clothing-item";
import { prisma } from "@/lib/prisma";
import { getCategoryById, getColourById, getSizeById } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: {
      item_id: Number(id)
    }
  });

  if (!item) return notFound();

  console.log(item.size_id);

  const category = getCategoryById(item.category_id) ?? undefined;
  const size = getSizeById(item.size_id) ?? undefined;
  const colour = getColourById(item.colour_id) ?? undefined;
  const isWaterproof = !!item.waterproof;

  return (
    <ClothingItem
      src={item.item_url}
      alt={item.item_name}
      name={item.item_name}
      category={category}
      size={size}
      colour={colour}
      isWaterproof={isWaterproof}
      environment={item.environment ?? undefined}
    />
  );
}