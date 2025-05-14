import { updateOutfit } from "@/lib/actions/update-outfit";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    outfit: {
      update: jest.fn(),
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

describe("updateOutfit", () => {
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

    const result = await updateOutfit(1, 2, 3);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "Not authenticated or user ID missing",
    });
  });

  it("should update the outfit successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const updatedOutfitData = {
      outfit_id: 1,
      outfit_name: "Updated Outfit",
      outfit_items: [
        {
          item: { item_id: 10, name: "Updated Shirt" },
        },
      ],
      user: mockSession.user,
    };

    (prisma.outfit.update as jest.Mock).mockResolvedValue(updatedOutfitData);

    const result = await updateOutfit(1, 10, 5);

    expect(prisma.outfit.update).toHaveBeenCalledWith({
      data: {
        outfit_items: {
          connect: [
            { outfit_id_item_id: { outfit_id: 1, item_id: 10 } },
          ],
          disconnect: [
            { outfit_id_item_id: { outfit_id: 1, item_id: 5 } },
          ],
        },
      },
      where: {
        user_id: mockSession.user.id,
        outfit_id: 1,
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
      outfit: updatedOutfitData,
    });
  });

  it("should handle errors when updating the outfit", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("DB failure");
    (prisma.outfit.update as jest.Mock).mockRejectedValue(error);

    const result = await updateOutfit(1, 10, 5);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "DB failure",
    });
  });

  it("should handle unexpected errors", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("Unexpected error");
    (prisma.outfit.update as jest.Mock).mockRejectedValue(error);

    const result = await updateOutfit(1, 10, 5);

    expect(result).toEqual({
      success: false,
      outfit: null,
      error: "Unexpected error",
    });
  });
});
