"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


type DeleteItemResult = {
  success: boolean
  error?: string
}

export async function deleteItem(itemId: number): Promise<DeleteItemResult> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Not authenticated or user ID missing",
      }
    }

    await prisma.item.delete({
      where: {
        user_id: session.user.id,
        item_id: itemId
      }
    });

    revalidatePath("/")
    revalidatePath(`/wardrobe/clothes/item/${itemId}`)

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