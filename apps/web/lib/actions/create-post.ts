"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ExtendedOutfit } from "@/app/profile/[username]/page"
import { Post, User } from "@prisma/client"
import { s3Upload } from "./s3-upload"

interface PostWithUser extends Post {
  user: User;
}

type CreatePostResult = {
  success: boolean
  post: PostWithUser | null
  error?: string
}

export async function createPost(formData: FormData): Promise<CreatePostResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return {
      success: false,
      post: null,
      error: "Not authenticated"
    }

    const post_title = formData.get("post_title") as string
    const post_text = formData.get("post_text") as string
    const outfitsJson = formData.get("outfits") as string
    const outfits = JSON.parse(outfitsJson) as ExtendedOutfit[]

    const photos = formData.getAll("photos") as File[]

    if (!post_title || !post_text) {
      return {
        success: false,
        post: null,
        error: "Title and content are required",
      }
    }

    const photoUrls = await Promise.all(photos.map(s3Upload))

    const post = await prisma.post.create({
      data: {
        user_id: session.user.id,
        post_title: post_title,
        post_text: post_text,
        images: photoUrls,
      },
      include: { outfits: true, user: true },
    });

    await prisma.postOutfit.createMany({
      data: outfits.map((outfit) => ({
        post_id: post.post_id,
        outfit_id: outfit.outfit_id,
      })),
      skipDuplicates: true,
    })

    revalidatePath("/")
    revalidatePath(`/profile/${post.user.username}/posts/${post.post_id}`)

    return {
      success: true,
      post: post,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      success: false,
      post: null,
      error: "An unexpected error occurred",
    }
  }
}
