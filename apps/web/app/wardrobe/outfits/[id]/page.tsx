import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const outfit = await prisma.outfit.findUnique({
    where: {
      outfit_id: Number(id)
    }
  });

  if (!outfit) return notFound();

  return (
    <>{JSON.stringify(outfit)}</>
  );
}