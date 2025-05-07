import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { ExtendedPost, Post } from "../post/post";

export interface UserWithPosts extends User {
  Post: ExtendedPost[];
}
export async function PostList({ id }: { id: number }) {
  const user = await prisma.user.findUnique({
    where: {
      user_id: id
    },
    include: {
      Post: {
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
                  }
                }
              }
            }
          },
          user: true
        },
        orderBy: {
          created_at: "desc"
        }
      }
    }
  }) as UserWithPosts | null;

  if (!user) {
    return <div>No user found.</div>
  }

  return (
    <div className="grid gap-4">
      {user.Post.length > 0 ? user.Post.map((post) => (
        <Post
          key={post.post_id}
          post={post}
          className="border rounded-lg"
        />
      )) : (
        <div>User has no posts</div>
      )}
    </div>
  );
}
