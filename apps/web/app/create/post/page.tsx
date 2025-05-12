import { ExtendedOutfit } from "@/app/profile/[username]/page";
import { CreatePostForm } from "@/components/post/create-post-form";
import { CreateOutfitQuickAction } from "@/components/wardrobe/create-outit-quick-action";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect('/sign-in');

  const outfits = await prisma.outfit.findMany({
    where: {
      user_id: session.user.id,
    },
    orderBy: {
      updated_at: "desc"
    },
    include: {
      outfit_items: {
        include: {
          item: {
            include: {
              category_tag: true,
              colour_tag: true,
              size_tag: true
            }
          }
        }
      }
    }
  }) as ExtendedOutfit[] | null;


  return (
    <div className="container max-w-3xl">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">Create New Post</h1>
      </header>
      <main className="p-4">
        {outfits && outfits.length > 0 ? (
          <CreatePostForm outfits={outfits} session={session} />
        ) : (
          <div>
            You must create an outfit in order to post.
            <CreateOutfitQuickAction />
          </div>
        )}
      </main>
    </div>
  );
}
