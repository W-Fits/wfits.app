import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// GET /api/item/[id]
export async function GET(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const item = await prisma.item.findUnique({
      where: { item_id: parseInt(id) },
    });


    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }


    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item", details: error.message },
      { status: 500 }
    );
  }
}


// PUT /api/item/[id] (Replaces the entire item)
export async function PUT(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const body = await request.json();


    const item = await prisma.item.update({
      where: { item_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item", details: error.message },
      { status: 500 }
    );
  }
}


// PATCH /api/item/[id] (Updates parts of the item)
export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;


  try {
    const body = await request.json();


    const item = await prisma.item.update({
      where: { item_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    console.error("Error patching item:", error);
    return NextResponse.json(
      { error: "Failed to patch item", details: error.message },
      { status: 500 }
    );
  }
}


// DELETE /api/item/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;


  try {
    await prisma.item.delete({
      where: { item_id: parseInt(id) },
    });


    return new NextResponse(null, { status: 204 }); // No content
  } catch (error: any) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item", details: error.message },
      { status: 500 }
    );
  }
}
