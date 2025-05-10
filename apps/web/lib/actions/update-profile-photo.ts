"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { User } from "@prisma/client"
import { s3Upload } from "./s3-upload"

export async function updateProfilePhoto(formData: FormData): Promise<{
  success: boolean,
  user: User | null,
  error?: string
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return {
      success: false,
      user: null,
      error: "Not authenticated"
    }

    const photo = formData.get("photo") as File;

    if (!photo) {
      return {
        success: false,
        user: null,
        error: "Title and content are required",
      }
    }

    const photoUrl = await s3Upload(photo);

    const user = await prisma.user.update({
      where: {
        user_id: session.user.id
      },
      data: {
        profile_photo: photoUrl
      }
    });

    revalidatePath("/")
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      user: user,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      success: false,
      user: null,
      error: "An unexpected error occurred",
    }
  }
}
