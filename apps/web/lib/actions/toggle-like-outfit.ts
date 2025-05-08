"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function toggleLikeOutfit(outfitId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("User not signed in.");

    // Check if the user has already liked this outfit
    const user = await prisma.user.findUnique({
      where: { user_id: session.user.id },
      select: {
        likedOutfits: {
          where: { outfit_id: outfitId },
          select: { outfit_id: true },
        },
      },
    });

    const hasLiked = user?.likedOutfits && user.likedOutfits.length > 0;

    if (hasLiked) {
      // Unlike the outfit
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          likedOutfits: {
            disconnect: { outfit_id: outfitId },
          },
        },
      });
      return { success: true, message: "Unliked outfit successfully." };
    } else {
      // Like the outfit
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          likedOutfits: {
            connect: { outfit_id: outfitId },
          },
        },
      });
      return { success: true, message: "Liked outfit successfully." };
    }
  } catch (error) {
    console.error("Failed to toggle outfit like:", error); // Log the error for debugging
    return { success: false, message: "Failed to toggle outfit like.", error: error };
  }
}
