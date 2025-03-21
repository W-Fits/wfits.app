import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colourTags = await prisma.colourTag.findMany();
    return NextResponse.json(colourTags, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching colour tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch colour tags", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const colourTag = await prisma.colourTag.create({
      data: body,
    });
    return NextResponse.json(colourTag, { status: 201 });
  } catch (error: any) {
    console.error("Error creating colour tag:", error);
    return NextResponse.json(
      { error: "Failed to create colour tag", details: error.message },
      { status: 500 }
    );
  }
}
