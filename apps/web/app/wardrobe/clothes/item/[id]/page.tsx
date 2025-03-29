import { ClothingItemEditor } from "@/components/wardrobe/clothing-item-editor";
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

  return (
    <ClothingItemEditor item={item} />
  );
}