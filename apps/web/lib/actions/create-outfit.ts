"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ExtendedItem, OutfitWithItems } from "@/components/wardrobe/outfit"
import { User } from "@prisma/client"

export interface CreatedOutfit extends OutfitWithItems {
  user: User;
}

type CreateOutfitResult = {
  success: boolean
  outfit: CreatedOutfit | null
  error?: string
}

export async function createOutfit(
  formData: FormData,
): Promise<CreateOutfitResult> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return {
        success: false,
        outfit: null,
        error: "Not authenticated or user ID missing",
      }
    }

    const outfit_name = formData.get("outfit_name") as string
    const itemsJson = formData.get("outfit_items") as string
    let items: ExtendedItem[] = []

    try {
      items = JSON.parse(itemsJson) as ExtendedItem[]
    } catch (parseError) {
      console.error("Error parsing outfit_items JSON:", parseError)
      return {
        success: false,
        outfit: null,
        error: "Invalid outfit items format",
      }
    }

    if (!outfit_name || items.length === 0) {
      return {
        success: false,
        outfit: null,
        error: "Name and at least one item are required",
      }
    }

    const outfitItemsCreateData = items.map((item) => ({
      item: {
        connect: {
          item_id: item.item_id,
        },
      },
    }))

    const outfit = await prisma.outfit.create({
      data: {
        user_id: session.user.id,
        outfit_name: outfit_name,
        outfit_items: {
          create: outfitItemsCreateData,
        },
      },
      include: {
        user: true,
        outfit_items: {
          include: {
            item: true,
          },
        },
      },
    }) as CreatedOutfit;

    revalidatePath("/")
    revalidatePath(`/wardrobe/outfit/${outfit.outfit_id}`)

    return {
      success: true,
      outfit: outfit,
    }
  } catch (error) {
    console.error("Error creating outfit:", error)
    return {
      success: false,
      outfit: null,
      error: "An unexpected error occurred",
    }
  }
}
