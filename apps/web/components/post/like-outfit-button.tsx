"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toggleLikePost } from "@/lib/actions/toggle-like-post";
import { toast } from "sonner";

export function LikeOutfitButton({ outfitId, initialLiked }: { outfitId: number; initialLiked: boolean }) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    // Optimistically update the UI
    setLiked((prev) => !prev);

    const result = await toggleLikePost(outfitId);

    if (!result.success) {
      setLiked((prev) => !prev);
      toast.warning(result.message);
    } else {
      toast.success(result.message);
    }

    setIsLoading(false);
  };

  return (
    <button onClick={handleToggleLike} disabled={isLoading}>
      <Heart
        className={cn(
          liked && "fill-red-500 stroke-red-500",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      />
    </button>
  );
}
