import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const sizeTags = await prisma.sizeTag.findMany();
    return NextResponse.json(sizeTags, { status: 200 });
  } catch (error) {
    console.error("Error fetching size tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch size tags", details: error },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sizeTag = await prisma.sizeTag.create({
      data: body,
    });
    return NextResponse.json(sizeTag, { status: 201 });
  } catch (error) {
    console.error("Error creating size tag:", error);
    return NextResponse.json(
      { error: "Failed to create size tag", details: error },
      { status: 500 }
    );
  }
}
