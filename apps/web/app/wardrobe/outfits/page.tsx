import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SmallOutfit } from "@/components/wardrobe/small-outfit";

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
  });

  return (
    <section>
      <header className="pt-12">
        <h1 className="text-3xl font-bold tracking-tight">My Outfits</h1>
      </header>
      <div className="flex flex-col gap-1">
        <Link
          className="px-2 py-1 w-fit rounded-md bg-primary text-background"
          href="/wardrobe/outfits/create"
        >
          Create Outfit
        </Link>
      </div>
      <div className="flex gap-2 flex-wrap mt-4">
        {outfits && outfits.map((outfit) => (
          <Link
            key={outfit.outfit_id}
            href={`/wardrobe/outfits/${outfit.outfit_id}`}
          >
            <SmallOutfit outfit={outfit} />
          </Link>
        ))}
      </div>
    </section>
  );
}
