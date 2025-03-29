import { ClothingClass } from "@/components/shared/category-select";
import { Colour } from "@/components/shared/colour-select";
import { Size } from "@/components/shared/size-select";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/components/wardrobe/clothing-item";
import { ClothingItemGrid } from "@/components/wardrobe/clothing-item-grid";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ClothesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user.id) return null;

  const items = await prisma.item.findMany({
    where: {
      user_id: session.user.id
    },
    include: {
      category_tag: true,
      colour_tag: true,
      size_tag: true,
    }
  });

  return (
    <section>
      <header className="pt-12">
        <h1 className="text-3xl font-bold tracking-tight">Clothes</h1>
        <Link
          href="/wardrobe/clothes/upload"
        >
          <Button>
            Upload item
          </Button>
        </Link>
      </header>
      <div className="flex gap-2 flex-wrap">
        <ClothingItemGrid
          items={items}
        />
      </div>
    </section>
  );
}