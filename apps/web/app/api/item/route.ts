import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.item.findMany();
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
