import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { OutfitWithItems } from "@/components/wardrobe/outfit";
import { OutfitGrid } from "@/components/wardrobe/outfit-grid";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateOutfitQuickAction } from "@/components/wardrobe/create-outit-quick-action";

export default async function OutfitsPage() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  const outfits = await prisma.outfit.findMany({
    where: {
      user_id: session.user.id,
    },
    include: {
      outfit_items: {
        include: {
          item: {
            include: {
              category_tag: true,
              colour_tag: true,
              size_tag: true,
            }
          }
        }
      },
    },
    orderBy: {
      created_at: "desc",
    }
  }) as OutfitWithItems[] | null;

  return (
    <div className="container space-y-4">
      <div className="flex items-center mb-2 ">
        <h1 className="text-3xl font-bold tracking-tight">My Outfits</h1>
      </div>
      <CreateOutfitQuickAction />
      <Suspense fallback={<Skeleton className="" />}>
        {outfits && <OutfitGrid outfits={outfits} />}
      </Suspense>
    </div>
  );
}
