import { ClothingItemGrid } from "@/components/wardrobe/clothing-item-grid";
import { UploadItemQuickAction } from "@/components/wardrobe/upload-item-quick-action";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

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
    <section className="p-4">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Clothes</h1>
        <UploadItemQuickAction />
      </header>
      <div className="flex gap-2 mt-4 flex-wrap">
        <ClothingItemGrid
          items={items}
        />
      </div>
    </section>
  );
}