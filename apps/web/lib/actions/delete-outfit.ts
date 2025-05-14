"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


type DeleteOutfitResult = {
  success: boolean
  error?: string
}

export async function deleteOutfit(outfitId: number): Promise<DeleteOutfitResult> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Not authenticated or user ID missing",
      }
    }

    const repsone = await prisma.outfit.delete({
      where: {
        user_id: session.user.id,
        outfit_id: outfitId
      }
    });

    revalidatePath("/")
    revalidatePath(`/wardrobe/outfits/${outfitId}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error creating outfit:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}