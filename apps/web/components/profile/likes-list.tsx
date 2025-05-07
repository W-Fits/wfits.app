import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { ExtendedPost, Post } from "../post/post";
import { ExtendedOutfit } from "@/app/profile/[username]/page";
import { OutfitPost } from "../post/outfit-post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface UserWithLikes extends User {
  LikePost: ExtendedPost[];
  LikeOutfit: ExtendedOutfit[];
}
export async function LikesList({ id }: { id: number }) {
  const user = await prisma.user.findUnique({
    where: {
      user_id: id
    },
    include: {
      LikePost: {
        include: {
          post: {
            include: {
              outfits: {
                include: {
                  outfit: {
                    include: {
                      outfit_items: {
                        include: {
                          item: {
                            include: {
                              colour_tag: true,
                              size_tag: true,
                              category_tag: true,
                            }
                          }
                        }
                      },
                    }
                  }
                }
              },
            },
          },
          user: true
        }
      },
      LikeOutfit: {
        include: {
          outfit: {
            include: {
              outfit_items: {
                include: {
                  item: {
                    include: {
                      colour_tag: true,
                      size_tag: true,
                      category_tag: true,
                    }
                  }
                }
              },
              user: true
            }
          }
        }
      }
    }
  }) as UserWithLikes | null;

  if (!user) {
    return <div>No user found.</div>
  }

  return (
    <Tabs defaultValue="liked-posts" className="w-full">
      <div className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="liked-posts" className="flex-1 justify-center">
            Liked Posts
          </TabsTrigger>
          <TabsTrigger value="liked-outfits" className="flex-1 justify-center">
            Liked Outfits
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="liked-posts" className="space-y-4">
        <div className="grid gap-4">
          {user.LikePost && user.LikePost.length > 0 ? user.LikePost.map((post) => (
            <Post
              key={post.post_id}
              post={post}
              className="border rounded-lg"
            />
          )) : (
            <div>User has liked no posts</div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="liked-outfits" className="space-y-4">
        <div className="grid gap-4">
          {user.LikeOutfit && user.LikeOutfit.length > 0 ? user.LikeOutfit.map((outfit) => (
            <OutfitPost
              key={outfit.outfit_id}
              outfit={outfit}
            />
          )) : (
            <div>User has liked no outfits</div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
