import { ExtendedPost, Post } from "@/components/post/post";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  if (!id) return notFound();

  const post = await prisma.post.findUnique({
    where: {
      post_id: Number(id)
    },
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
                      size_tag: true,
                      colour_tag: true
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
  }) as ExtendedPost | null;

  if (!post) return notFound();

  return (
    <div className="p-4">
      <Post post={post} />
    </div>
  );
}
