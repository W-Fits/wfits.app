"use server"

import { revalidatePath } from "next/cache"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { ExtendedOutfit } from "@/app/profile/[username]/page"
import { env } from "../env"
import { Post, User } from "@prisma/client"

const s3 = new S3Client({
  region: env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})


interface PostWithUser extends Post {
  user: User;
}

type CreatePostResult = {
  success: boolean
  post: PostWithUser | null
  error?: string
}

async function uploadFileToS3(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const fileExtension = file.name.split(".").pop()
  const key = `posts/${randomUUID()}.${fileExtension}`

  const uploadParams = {
    Bucket: "wfits-bucket",
    Key: key,
    Body: buffer,
    ContentType: "image/png"
  }

  await s3.send(new PutObjectCommand(uploadParams))

  return `https://wfits-bucket.s3.amazonaws.com/${key}`
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

    const photoUrls = await Promise.all(photos.map(uploadFileToS3))

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
