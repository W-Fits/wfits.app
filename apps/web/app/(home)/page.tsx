import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OutfitPost } from "@/components/post/outfit-post";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { ExtendedPost, Post } from "@/components/post/post";
import { ExtendedOutfit } from "@/app/profile/[username]/page";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect('/sign-in');

  const profile = await prisma.user.findUnique({
    where: {
      user_id: session.user.id
    },
    include: {
      following: true,
    }
  });

  if (!profile) return (
    <section>
      Error
    </section>
  );

  const followingOutfits = await prisma.outfit.findMany({
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
      user: true,
    },
    where: {
      user_id: {
        in: profile.following.map((user) => user.user_id)
      }
    },
    orderBy: {
      created_at: "desc",
    },
    take: 3
  }) as ExtendedOutfit[] | null;

  const followingPosts = await prisma.post.findMany({
    include: {
      outfits: {
        include: {
          outfit: {
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
              user: true
            },
          }
        }
      },
      user: true
    },
    where: {
      user_id: {
        in: profile.following.map((user) => user.user_id)
      }
    },
    orderBy: {
      created_at: "desc",
    },
    take: 3
  }) as ExtendedPost[] | null;

  return (
    <section className="grid space-y-2 p-4">
      <section className="flex-1 space-y-2">
        <div className="flex gap-1">
          <h1 className="font-bold">Following Outfits</h1>
          {followingOutfits && followingOutfits.length > 0 && (
            <Link className="flex gap-1 items-center" href="outfits">
              <ChevronRight className="w-4 h-4" />
              View all
            </Link>
          )}
        </div>
        {followingOutfits && followingOutfits.length > 0 ? (
          <div className="space-y-4">
            {followingOutfits.map((outfit, index) => (
              <OutfitPost key={index} outfit={outfit} />
            ))}
          </div>
        ) : (
          <div>
            There are no new outfits from people you follow.
            <Link href="/search" className="flex mt-2 max-w-[75%] aspect-video  cursor-pointer mx-auto bg-muted/10 rounded-lg flex-col items-center justify-center p-4 transition-all border border-muted/70 shadow-xs">
              <div className="flex justify-center items-center h-20 w-20 p-4 bg-muted rounded-full">
                <Search className="w-full h-full stroke-primary/80" />
              </div>
              <span className="text-center text-balance">
                Search for new people to follow.
              </span>
            </Link>
          </div>
        )}
      </section>
      <section className="flex-1 space-y-2">
        <div className="flex gap-1">
          <h1 className="font-bold">Following Posts</h1>
          {followingPosts && followingPosts.length > 0 && (
            <Link className="flex gap-1 items-center" href="posts">
              <ChevronRight className="w-4 h-4" />
              View all
            </Link>
          )}
        </div>
        {followingPosts && followingPosts.length > 0 ? (
          <div className="space-y-4">
            {followingPosts.map((post) => (
              <Post key={post.post_id} post={post} className="border rounded-lg hover:bg-accent/50 " />
            ))}
          </div>
        ) : (
          <div>
            There are no new posts from people you follow.
            <Link href="/search" className="flex mt-2 max-w-[75%] aspect-video  cursor-pointer mx-auto bg-muted/10 rounded-lg flex-col items-center justify-center p-4 transition-all border border-muted/70 shadow-xs">
              <div className="flex justify-center items-center h-20 w-20 p-4 bg-muted rounded-full">
                <Search className="w-full h-full stroke-primary/80" />
              </div>
              <span className="text-center text-balance">
                Search for new people to follow.
              </span>
            </Link>
          </div>
        )}
      </section>
    </section>
  );
}