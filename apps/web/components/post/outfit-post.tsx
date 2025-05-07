import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Outfit as OutfitType, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { FollowButton } from "../shared/follow-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { LikeOutfitButton } from "./like-outfit-button";
import { ExtendedOutfit } from "@/app/profile/[username]/page";

export async function OutfitPost({
  outfit,
  className
}: {
  outfit: ExtendedOutfit;
  className?: string;
}) {
  const session = await getServerSession(authOptions);

  const isCurrentUser = outfit.user_id === session?.user.id;
  let isFollowing = false;
  let initialLiked = false;

  if (session && !isCurrentUser) {
    const currentUserWithRelations = await prisma.user.findFirst({
      where: {
        user_id: session.user.id,
      },
      include: {
        following: {
          where: {
            user_id: outfit.user_id
          }
        },
        LikeOutfit: {
          where: {
            outfit_id: outfit.outfit_id
          }
        }
      }
    });

    isFollowing = !!currentUserWithRelations?.following.length;
    initialLiked = !!currentUserWithRelations?.LikeOutfit.length;
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors",
        className
      )}>
      <div className="flex gap-2 flex-col">
        <div className="flex justify-between">
          <Link className="flex w-fit gap-2 items-center cursor-pointer" href={`/profile/${outfit.user?.username}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/icon"></AvatarImage>
              <AvatarFallback>PFP</AvatarFallback>
            </Avatar>
            <span>
              {outfit.user?.username}
            </span>
          </Link>
          {!isCurrentUser && (
            <FollowButton targetUserId={outfit.user_id} isFollowing={isFollowing} />
          )}
        </div>
        <Link
          href={`/profile/${outfit.user?.username}/outfit/${outfit.outfit_id}`}
          className="grid grid-cols-2 grid-rows-2 w-full rounded-md p-2 bg-muted"
        >
          {outfit.outfit_items.slice(0, 4).map((outfit_item) => (
            <Image
              key={outfit_item.item_id} // Use item_id as a unique key
              className="flex-1 aspect-square object-contain"
              src={outfit_item.item.item_url}
              width="200"
              height="200"
              alt="Clothing Image"
            />
          ))}
        </Link>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">{outfit.outfit_name}</h3>
            <span className="text-muted-foreground">{outfit.created_at.toLocaleDateString()}</span>
          </div>
          <LikeOutfitButton outfitId={outfit.outfit_id} initialLiked={initialLiked} />
        </div>
      </div>
    </div>
  )
}