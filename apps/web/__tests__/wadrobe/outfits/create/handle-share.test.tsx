describe("handleShare", () => {
  const mockSetShareStatus = jest.fn();

  const mockOutfit = {
    outfit_id: 123,
    user: {
      username: "testuser",
    },
  };

  const buildHandleShare = (createdOutfit: any) => {
    return () => {
      if (!createdOutfit) return null;

      const shareUrl = `${window.location.origin}/profile/${createdOutfit.user.username}/outfit/${createdOutfit.outfit_id}`;

      if (navigator.share) {
        navigator
          .share({
            title: "Check out my outfit!",
            text: "I created a new outfit. Take a look!",
            url: shareUrl,
          })
          .then(() => mockSetShareStatus("Shared successfully!"))
          .catch((error) => {
            console.error("Error sharing:", error);
            mockSetShareStatus("Error sharing");
          });
      } else {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => mockSetShareStatus("Link copied to clipboard!"))
          .catch((error) => {
            console.error("Error copying to clipboard:", error);
            prompt("Copy this link to share your outfit:", shareUrl);
          });
      }
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if createdOutfit is null", () => {
    const handle = buildHandleShare(null);
    expect(handle()).toBeNull();
  });

  it("should use navigator.share when available", async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    (navigator as any).share = mockShare;

    const handle = buildHandleShare(mockOutfit);
    await handle();

    expect(mockShare).toHaveBeenCalledWith({
      title: "Check out my outfit!",
      text: "I created a new outfit. Take a look!",
      url: expect.stringContaining("/profile/testuser/outfit/123"),
    });
  });

  it("should set error when navigator.share fails", async () => {
    const mockShare = jest.fn().mockRejectedValue(new Error("fail"));
    (navigator as any).share = mockShare;

    const handle = buildHandleShare(mockOutfit);
    await handle();

    expect(mockSetShareStatus).toHaveBeenCalledWith("Error sharing");
  });

  it("should fallback to clipboard if navigator.share is not available", async () => {
    delete (navigator as any).share;

    const mockClipboardWrite = jest.fn().mockResolvedValue(undefined);
    (navigator.clipboard as any) = {
      writeText: mockClipboardWrite,
    };

    const handle = buildHandleShare(mockOutfit);
    await handle();

    expect(mockClipboardWrite).toHaveBeenCalledWith(
      expect.stringContaining("/profile/testuser/outfit/123")
    );
    expect(mockSetShareStatus).toHaveBeenCalledWith("Link copied to clipboard!");
  });

  it("should prompt if clipboard fails", async () => {
    delete (navigator as any).share;

    const mockClipboardWrite = jest.fn().mockRejectedValue(new Error("fail"));
    (navigator.clipboard as any) = {
      writeText: mockClipboardWrite,
    };
    const mockPrompt = jest.fn();
    global.prompt = mockPrompt;

    const handle = buildHandleShare(mockOutfit);
    await handle();

    expect(mockPrompt).toHaveBeenCalledWith(
      expect.stringContaining("Copy this link"),
      expect.stringContaining("/profile/testuser/outfit/123")
    );
  });
});
