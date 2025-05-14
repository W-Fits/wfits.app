import { deleteOutfit } from "@/lib/actions/delete-outfit";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    outfit: {
      delete: jest.fn(),
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

describe("deleteOutfit", () => {
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

    const result = await deleteOutfit(1);

    expect(result).toEqual({
      success: false,
      error: "Not authenticated or user ID missing",
    });
  });

  it("should delete the outfit successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    (prisma.outfit.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteOutfit(1);

    expect(prisma.outfit.delete).toHaveBeenCalledWith({
      where: {
        user_id: mockSession.user.id,
        outfit_id: 1,
      },
    });

    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/wardrobe/outfits/1");

    expect(result).toEqual({
      success: true,
    });
  });

  it("should handle errors when deleting the outfit", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("DB failure");
    (prisma.outfit.delete as jest.Mock).mockRejectedValue(error);

    const result = await deleteOutfit(1);

    expect(result).toEqual({
      success: false,
      error: "An unexpected error occurred",
    });
  });

  it("should handle unexpected errors", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("Unexpected error");
    (prisma.outfit.delete as jest.Mock).mockRejectedValue(error);

    const result = await deleteOutfit(1);

    expect(result).toEqual({
      success: false,
      error: "An unexpected error occurred",
    });
  });
});
