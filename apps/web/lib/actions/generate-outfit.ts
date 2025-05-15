"use server";

import { getServerSession } from "next-auth";
import { authOptions, getAccessToken } from "@/lib/auth";
import { Category } from "@/components/shared/category-select";
import { ExtendedItem } from "@/components/wardrobe/outfit";

export type GeneratedOutfit = Partial<Record<Category, ExtendedItem>>;
export async function generateOutfit(formData: FormData): Promise<{
  success: boolean;
  outfit: GeneratedOutfit | null;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthenticated.");
    }

    const longitude = parseFloat(formData.get("longitude") as string);
    const latitude = parseFloat(formData.get("latitude") as string);

    const waterproof = formData.get("waterproof") === "true";
    let environment = formData.get("environment") as string | null;

    if (environment && ["Warm", "Cold"].includes(environment)) {
      environment = null;
    }

    const token = await getAccessToken();

    if (!token) {
      throw new Error("Couldn't generate JWT token");
    }

    const body = JSON.stringify({
      filters: {
        environment,
        waterproof
      },
      user_id: session.user.id,
      longitude,
      latitude
    });

    console.log(body);

    const response = await fetch(`http://127.0.0.1:4000/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });



    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return {
      success: true,
      outfit: data as GeneratedOutfit
    }

  } catch (error) {
    return {
      success: false,
      outfit: null,
      error: String(error)
    }
  }
}