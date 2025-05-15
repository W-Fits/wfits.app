import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categoryTags = await prisma.categoryTag.findMany();
    return NextResponse.json(categoryTags, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category tags", details: error },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryTag = await prisma.categoryTag.create({
      data: body,
    });
    return NextResponse.json(categoryTag, { status: 201 });
  } catch (error) {
    console.error("Error creating category tag:", error);
    return NextResponse.json(
      { error: "Failed to create category tag", details: error },
      { status: 500 }
    );
  }
}
