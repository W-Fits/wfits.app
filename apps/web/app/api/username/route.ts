import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json(false, { status: 400 })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username
      },
      select: {
        user_id: true
      }
    });

    const isAvailable = !!!user;

    return NextResponse.json(isAvailable)
  } catch (error) {
    console.error("Error checking username availability:", error)
    return NextResponse.json(false, { status: 500 })
  }
}
