import { createOutfit } from "@/lib/actions/create-outfit";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    outfit: {
      create: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("createOutfit", () => {
  const mockSession = {
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.set("outfit_name", "My Outfit");
    formData.set("outfit_items", JSON.stringify([]));

    const result = await createOutfit(formData);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "Not authenticated or user ID missing",
    });
  });

  it("should return an error for invalid JSON in outfit_items", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const formData = new FormData();
    formData.set("outfit_name", "Invalid JSON Outfit");
    formData.set("outfit_items", "not-json");

    const result = await createOutfit(formData);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "Invalid outfit items format",
    });
  });

  it("should return an error if name or items are missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const formData = new FormData();
    formData.set("outfit_name", "");
    formData.set("outfit_items", JSON.stringify([]));

    const result = await createOutfit(formData);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "Name and at least one item are required",
    });
  });

  it("should create an outfit successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const outfitData = {
      outfit_id: 1,
      outfit_name: "My Test Outfit",
      outfit_items: [
        {
          item: { item_id: 10, name: "Test Shirt" },
        },
      ],
      user: mockSession.user,
    };

    (prisma.outfit.create as jest.Mock).mockResolvedValue(outfitData);

    const formData = new FormData();
    formData.set("outfit_name", outfitData.outfit_name);
    formData.set("outfit_items", JSON.stringify([{ item_id: 10 }]));

    const result = await createOutfit(formData);

    expect(prisma.outfit.create).toHaveBeenCalledWith({
      data: {
        user_id: mockSession.user.id,
        outfit_name: outfitData.outfit_name,
        outfit_items: {
          create: [
            {
              item: {
                connect: {
                  item_id: 10,
                },
              },
            },
          ],
        },
      },
      include: {
        user: true,
        outfit_items: {
          include: {
            item: true,
          },
        },
      },
    });

    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/wardrobe/outfit/1");

    expect(result).toEqual({
      success: true,
      outfit: outfitData,
    });
  });

  it("should handle unexpected errors", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("DB failure");
    (prisma.outfit.create as jest.Mock).mockRejectedValue(error);

    const formData = new FormData();
    formData.set("outfit_name", "Error Outfit");
    formData.set("outfit_items", JSON.stringify([{ item_id: 1 }]));

    const result = await createOutfit(formData);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "An unexpected error occurred",
    });
  });
});
