"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function toggleLikeOutfit(outfitId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("User not signed in.");

    const existingLike = await prisma.likeOutfit.findUnique({
      where: {
        user_id_outfit_id: {
          user_id: session.user.id,
          outfit_id: outfitId,
        },
      },
    });

    if (existingLike) {
      await prisma.likeOutfit.delete({
        where: {
          user_id_outfit_id: {
            user_id: session.user.id,
            outfit_id: outfitId,
          },
        },
      });
      return { success: true, message: "Unliked outfit successfully." };
    } else {
      await prisma.likeOutfit.create({
        data: {
          user_id: session.user.id,
          outfit_id: outfitId,
        },
      });
      return { success: true, message: "Liked outfit successfully." };
    }
  } catch (error) {
    return { success: false, message: "Failed to toggle outfit like.", error: error };
  }
}
