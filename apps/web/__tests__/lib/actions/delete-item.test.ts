import { deleteItem } from "@/lib/actions/delete-item";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    item: {
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

describe("deleteItem", () => {
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

    const result = await deleteItem(1);

    expect(result).toEqual({
      success: false,
      error: "Not authenticated or user ID missing",
    });
  });

  it("should delete the item successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    (prisma.item.delete as jest.Mock).mockResolvedValue({});

    const result = await deleteItem(1);

    expect(prisma.item.delete).toHaveBeenCalledWith({
      where: {
        user_id: mockSession.user.id,
        item_id: 1,
      },
    });

    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/wardrobe/clothes/item/1");

    expect(result).toEqual({
      success: true,
    });
  });

  it("should handle errors when deleting the item", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("DB failure");
    (prisma.item.delete as jest.Mock).mockRejectedValue(error);

    const result = await deleteItem(1);

    expect(result).toEqual({
      success: false,
      error: "An unexpected error occurred",
    });
  });

  it("should handle unexpected errors", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const error = new Error("Unexpected error");
    (prisma.item.delete as jest.Mock).mockRejectedValue(error);

    const result = await deleteItem(1);

    expect(result).toEqual({
      success: false,
      error: "An unexpected error occurred",
    });
  });
});
