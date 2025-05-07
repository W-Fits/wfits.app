"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export async function toggleLikePost(postId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("User not signed in.");

    const existingLike = await prisma.likePost.findUnique({
      where: {
        user_id_post_id: {
          user_id: session.user.id,
          post_id: postId,
        },
      },
    });

    if (existingLike) {
      await prisma.likePost.delete({
        where: {
          user_id_post_id: {
            user_id: session.user.id,
            post_id: postId,
          },
        },
      });
      return { success: true, message: "Unliked post successfully." };
    } else {
      await prisma.likePost.create({
        data: {
          user_id: session.user.id,
          post_id: postId,
        },
      });
      return { success: true, message: "Liked post successfully." };
    }
  } catch (error) {
    return { success: false, message: "Failed to toggle post like." };
  }
}