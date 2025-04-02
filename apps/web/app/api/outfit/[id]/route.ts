import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface Params {
  params: { id: string };
}


// GET /api/outfit/[id]
export async function GET(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const outfit = await prisma.outfit.findUnique({
      where: { outfit_id: parseInt(id) },
      include: {
        outfit_items: true,
      },
    });


    if (!outfit) {
      return NextResponse.json({ error: "Outfit not found" }, { status: 404 });
    }


    return NextResponse.json(outfit, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching outfit:", error);
    return NextResponse.json(
      { error: "Failed to fetch outfit", details: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/outfit/[id] (Replaces the entire outfit)
export async function PUT(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const body = await request.json();


    const outfit = await prisma.outfit.update({
      where: { outfit_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(outfit, { status: 200 });
  } catch (error: any) {
    console.error("Error updating outfit:", error);
    return NextResponse.json(
      { error: "Failed to update outfit", details: error.message },
      { status: 500 }
    );
  }
}


// PATCH /api/outfit/[id] (Updates parts of the outfit)
export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const body = await request.json();


    const outfit = await prisma.outfit.update({
      where: { outfit_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(outfit, { status: 200 });
  } catch (error: any) {
    console.error("Error patching outfit:", error);
    return NextResponse.json(
      { error: "Failed to patch outfit", details: error.message },
      { status: 500 }
    );
  }
}


// DELETE /api/outfit/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;


  try {
    await prisma.outfit.delete({
      where: { outfit_id: parseInt(id) },
    });


    return new NextResponse(null, { status: 204 }); // No content
  } catch (error: any) {
    console.error("Error deleting outfit:", error);
    return NextResponse.json(
      { error: "Failed to delete outfit", details: error.message },
      { status: 500 }
    );
  }
}
