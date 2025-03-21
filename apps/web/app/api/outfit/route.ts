import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const outfits = await prisma.outfit.findMany();
    return NextResponse.json(outfits, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching outfits:", error);
    return NextResponse.json(
      { error: "Failed to fetch outfits", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const outfit = await prisma.outfit.create({
      data: body,
    });
    return NextResponse.json(outfit, { status: 201 });
  } catch (error: any) {
    console.error("Error creating outfit:", error);
    return NextResponse.json(
      { error: "Failed to create outfit", details: error.message },
      { status: 500 }
    );
  }
}
