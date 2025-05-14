import { toggleFollowUser } from "@/lib/actions/toggle-follow-user"; // Adjust the import path as needed
import { prisma } from "@/lib/prisma"; // Mock this
import { getServerSession } from "next-auth"; // Mock this

// Mock prisma and getServerSession 
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
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

describe("toggleFollowUser", () => {
  const mockSession = {
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    },
  };
  const targetUserId = 2;

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the user is not signed in", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const result = await toggleFollowUser(targetUserId);

    expect(result).toEqual({
      success: false,
      message: "Failed to toggle follow.",
      error: expect.any(Error),
    });
    // @ts-ignore
    expect(result.error.message).toBe("User not signed in.");
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should return an error if the user tries to follow themselves", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);

    const result = await toggleFollowUser(mockSession.user.id);

    expect(result).toEqual({
      success: false,
      message: "Cannot follow yourself.",
    });
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should unfollow a user if already following", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    // Simulate the user is already following
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      user_id: mockSession.user.id,
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({}); // Mock the update result

    const result = await toggleFollowUser(targetUserId);

    expect(getServerSession).toHaveBeenCalledWith(expect.any(Object)); // Check that authOptions was passed
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: mockSession.user.id,
        following: {
          some: {
            user_id: targetUserId,
          },
        },
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { user_id: mockSession.user.id },
      data: {
        following: {
          disconnect: [{ user_id: targetUserId }],
        },
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Unfollowed user successfully.",
    });
  });

  it("should follow a user if not already following", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    // Simulate the user is not following
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.update as jest.Mock).mockResolvedValue({}); // Mock the update result

    const result = await toggleFollowUser(targetUserId);

    expect(getServerSession).toHaveBeenCalledWith(expect.any(Object)); // Check that authOptions was passed
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        user_id: mockSession.user.id,
        following: {
          some: {
            user_id: targetUserId,
          },
        },
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { user_id: mockSession.user.id },
      data: {
        following: {
          connect: [{ user_id: targetUserId }],
        },
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Followed user successfully.",
    });
  });

  it("should handle errors during the process", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const mockError = new Error("Database connection failed");
    // Simulate an error during the findFirst call
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(mockError);

    const result = await toggleFollowUser(targetUserId);

    expect(result).toEqual({
      success: false,
      message: "Failed to toggle follow.",
      error: mockError,
    });
    expect(getServerSession).toHaveBeenCalledWith(expect.any(Object));
    expect(prisma.user.findFirst).toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled(); // Update should not be called if find fails
  });
});
