"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function toggleLikePost(postId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("User not signed in.");

    // Check if the user has already liked this post
    const user = await prisma.user.findUnique({
      where: { user_id: session.user.id },
      select: {
        likedPosts: {
          where: { post_id: postId },
          select: { post_id: true }, // Select just the ID to check for existence
        },
      },
    });

    const hasLiked = user?.likedPosts && user.likedPosts.length > 0;

    if (hasLiked) {
      // Unlike the post
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          likedPosts: {
            disconnect: { post_id: postId },
          },
        },
      });
      return { success: true, message: "Unliked post successfully." };
    } else {
      // Like the post
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          likedPosts: {
            connect: { post_id: postId },
          },
        },
      });
      return { success: true, message: "Liked post successfully." };
    }
  } catch (error) {
    console.error("Failed to toggle post like:", error); // Log the error for debugging
    return { success: false, message: "Failed to toggle post like." };
  }
}
