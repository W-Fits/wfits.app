import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/users/[id]
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;


  try {
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(id) },
    });


    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }


    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error },
      { status: 500 }
    );
  }
}


// PUT /api/users/[id] (Replaces the entire user)
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;


  try {
    const body = await request.json();


    const user = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error },
      { status: 500 }
    );
  }
}


// PATCH /api/users/[id] (Updates parts of the user)
export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;


  try {
    const body = await request.json();


    const user = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: body,
    });


    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error patching user:", error);
    return NextResponse.json(
      { error: "Failed to patch user", details: error },
      { status: 500 }
    );
  }
}


// DELETE /api/users/[id]
export async function DELETE(request: Request, { params }: Params) {
  const { id } = await params;


  try {
    await prisma.user.delete({
      where: { user_id: parseInt(id) },
    });


    return new NextResponse(null, { status: 204 }); // No content
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error },
      { status: 500 }
    );
  }
}
