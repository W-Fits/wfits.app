import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExtendedOutfit } from "../../page";
import { Outfit } from "@/components/wardrobe/outfit";

export default async function OutfitPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  if (!id) return notFound();

  const outfit = await prisma.outfit.findUnique({
    where: {
      outfit_id: Number(id)
    },
    include: {
      outfit_items: {
        include: {
          outfit: {
            include: {
              outfit_items: {
                include: {
                  item: {
                    include: {
                      category_tag: true,
                      size_tag: true,
                      colour_tag: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      user: true
    },
  }) as ExtendedOutfit | null;

  if (!outfit) return notFound();

  return (
    <div className="p-4">
      <Outfit initialOutfit={outfit} edit={false} />
    </div>
  );
}
