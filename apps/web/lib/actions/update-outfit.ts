"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OutfitWithItems } from "@/components/wardrobe/outfit"
import { User } from "@prisma/client"

export interface UpdatedOutfit extends OutfitWithItems {
  user: User;
}

type UpdatedOutfitResult = {
  success: boolean
  outfit: UpdatedOutfit | null
  error?: string
}

export async function updateOutfit(
  outfitId: number,
  newItemId: number,
  oldItemId: number,
): Promise<UpdatedOutfitResult> {
  try {
    const session = await getServerSession(authOptions);

    // Ensure session exists and user ID is valid
    if (!session || !session.user?.id) {
      return {
        success: false,
        outfit: null,
        error: "Not authenticated or user ID missing",
      }
    }

    // Attempt to update the outfit in the database
    const outfit = await prisma.outfit.update({
      data: {
        outfit_items: {
          connect: [
            { outfit_id_item_id: { outfit_id: outfitId, item_id: newItemId } }, // Connecting the new item to the outfit
          ],
          disconnect: [
            { outfit_id_item_id: { outfit_id: outfitId, item_id: oldItemId } }, // Disconnecting the old item from the outfit
          ]
        }
      },
      where: {
        user_id: session.user.id,
        outfit_id: outfitId,
      },
      include: {
        user: true,
        outfit_items: {
          include: {
            item: true,
          },
        },
      },
    });

    // Revalidate the paths after the update
    revalidatePath("/")
    revalidatePath(`/wardrobe/outfit/${outfit.outfit_id}`)

    return {
      success: true,
      outfit: outfit as UpdatedOutfit, // Ensure the correct type is returned
    }
  } catch (error) {
    console.error("Error updating outfit:", error);
    // If Prisma or other errors are encountered, log the actual error
    return {
      success: false,
      outfit: null,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}
