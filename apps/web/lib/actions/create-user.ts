"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt-ts";

export async function createUser(username: string, password: string, email: string) {
  "use server";
  try {
    const createResponse = await prisma.user.create({
      data: {
        username,
        email,
        password: await hash(password, 8),
      },
    });

    if (!createResponse) throw new Error("Error creating user");

  } catch (error) {
    console.warn(error);
  }
}