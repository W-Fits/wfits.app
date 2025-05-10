import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("category_id");
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const items = await prisma.item.findMany({
      where: {
        category_id: Number(categoryId),
        user_id: session.user.id
      },
      orderBy: {
        item_name: "asc",
      },
      include: {
        colour_tag: true,
        category_tag: true,
        size_tag: true
      }
    })
    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.item.create({
      data: body,
      include: {
        user: true,
        category_tag: true,
        colour_tag: true,
        size_tag: true,
        outfit_items: true,
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item", details: error.message },
      { status: 500 }
    );
  }
}
