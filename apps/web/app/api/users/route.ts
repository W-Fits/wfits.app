// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET a users
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany();

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}