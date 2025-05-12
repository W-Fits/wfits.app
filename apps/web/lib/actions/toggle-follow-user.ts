"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function toggleFollowUser(
  targetUserId: number
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("User not signed in.")

    if (session.user.id === targetUserId) {
      return { success: false, message: "Cannot follow yourself." };
    }

    const existingFollow = await prisma.user.findFirst({
      where: {
        user_id: session.user.id,
        following: {
          some: {
            user_id: targetUserId,
          },
        },
      },
    });

    if (existingFollow) {
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          following: {
            disconnect: [{ user_id: targetUserId }],
          },
        },
      });
      return { success: true, message: "Unfollowed user successfully." };
    } else {
      await prisma.user.update({
        where: { user_id: session.user.id },
        data: {
          following: {
            connect: [{ user_id: targetUserId }],
          },
        },
      });
      return { success: true, message: "Followed user successfully." };
    }
  } catch (error) {
    return { success: false, message: "Failed to toggle follow.", error: error };
  }
}
