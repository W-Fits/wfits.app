"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toggleFollowUser } from "@/lib/actions/toggle-follow-user";
import { useRouter } from "next/navigation";

export function FollowButton({
  targetUserId,
  isFollowing: initialIsFollowing
}: {
  targetUserId: number;
  isFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleFollow = async () => {
    setIsLoading(true);
    const result = await toggleFollowUser(targetUserId,);
    setIsLoading(false);

    if (result.success) {
      setIsFollowing(!isFollowing);
    } else if (result.error === "User not signed in.") {
      router.push("/sign-in");
    } else {
      console.error("Failed to toggle follow:", result.error);
    }
  };

  return (
    <Button onClick={handleToggleFollow} disabled={isLoading}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
