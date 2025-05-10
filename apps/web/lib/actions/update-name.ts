"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { User } from "@prisma/client"

export async function updateName(name: string): Promise<{
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

    name = name.trim();

    const validNameRegex = /^[A-Za-z\s]+$/;

    if (!validNameRegex.test(name)) {
      return {
        success: false,
        user: null,
        error: "Name can only contain letters and spaces."
      };
    }

    if (name.length < 2 || name.length > 50) {
      return {
        success: false,
        user: null,
        error: "Name must be between 2 and 50 characters."
      };
    }

    const user = await prisma.user.update({
      where: {
        user_id: session.user.id
      },
      data: {
        firstname: name
      }
    });

    revalidatePath("/")
    revalidatePath(`/profile/${user.username}`)

    return {
      success: true,
      user: user,
    }
  } catch (error) {
    console.error("Error updating name:", error)
    return {
      success: false,
      user: null,
      error: "An unexpected error occurred",
    }
  }
}
