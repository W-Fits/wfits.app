import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { ExtendedPost } from "../post/post"; // Assuming ExtendedPost structure is still relevant
import { ExtendedOutfit } from "@/app/profile/[username]/page"; // Assuming ExtendedOutfit structure is still relevant
import { OutfitPost } from "../post/outfit-post";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Post } from "../post/post"; // Assuming the Post component uses ExtendedPost

// Update the UserWithLikes interface to reflect the implicit relations
export interface UserWithLikes extends User {
  likedPosts: ExtendedPost[]; // Use the field name from the implicit relation
  likedOutfits: ExtendedOutfit[]; // Use the field name from the implicit relation
}

export async function LikesList({ id }: { id: number }) {
  const user = await prisma.user.findUnique({
    where: {
      user_id: id,
    },
    include: {
      // Include the implicit many-to-many relationships
      likedPosts: {
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          user: true,
        },
      },
      likedOutfits: {
        include: {
          outfit_items: {
            include: {
              item: {
                include: {
                  colour_tag: true,
                  size_tag: true,
                  category_tag: true,
                },
              },
            },
          },
          user: true,
        },
      },
    },
  }) as UserWithLikes | null; // Cast to the updated interface

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <Tabs defaultValue="liked-posts" className="w-full">
      <div className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="liked-posts" className="flex-1 justify-center">
            Liked Posts ({user.likedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="liked-outfits" className="flex-1 justify-center">
            Liked Outfits ({user.likedOutfits.length})
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="liked-posts" className="space-y-4">
        <div className="grid gap-4">
          {/* Access liked posts via the new field name */}
          {user.likedPosts && user.likedPosts.length > 0 ? (
            user.likedPosts.map((post) => (
              <Post
                key={post.post_id}
                post={post} // The 'post' here is already the full post data
                className="border rounded-lg"
              />
            ))
          ) : (
            <div>User has liked no posts</div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="liked-outfits" className="space-y-4">
        <div className="grid gap-4">
          {/* Access liked outfits via the new field name */}
          {user.likedOutfits && user.likedOutfits.length > 0 ? (
            user.likedOutfits.map((outfit) => (
              <OutfitPost
                key={outfit.outfit_id}
                outfit={outfit} // The 'outfit' here is already the full outfit data
              />
            ))
          ) : (
            <div>User has liked no outfits</div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
