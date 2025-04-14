import { Outfit, OutfitWithItems } from "@/components/wardrobe/outfit";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) return redirect("/sign-in");

  const outfit = await prisma.outfit.findUnique({
    where: {
      outfit_id: Number(id),
      user_id: session.user.id
    },
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
  });

  if (!outfit) return notFound();

  return (
    <Outfit initialOutfit={outfit as OutfitWithItems} />
  );
}