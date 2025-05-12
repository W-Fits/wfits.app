import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Item } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const outfits = await prisma.outfit.findMany({
      where: {
        user_id: session.user.id,
      },
      include: {
        outfit_items: {
          include: {
            item: {
              include: {
                category_tag: true,
                colour_tag: true,
                size_tag: true
              }
            }
          }
        }
      }
    });

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
    const { outfit_items, outfit_name } = await request.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 403 });
    }

    const outfit = await prisma.outfit.create({
      data: {
        user_id: session.user.id,
        outfit_name: outfit_name
      },
    });

    const items = await prisma.outfitItem.createMany({
      data: [...outfit_items.map((item: Item) => ({ outfit_id: outfit.outfit_id, item_id: item.item_id }))],
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
