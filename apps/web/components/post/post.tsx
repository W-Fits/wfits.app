import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Post as PostType, User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { ExtendedOutfit } from "@/app/profile/[username]/page";
import { LikePostButton } from "./like-post-button";
import { PostImages } from "./post-images";
import { FollowButton } from "../shared/follow-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export interface ExtendedPost extends PostType {
  outfits: ExtendedOutfit[];
  user: User;
}

export async function Post({
  post,
  className
}: {
  post: ExtendedPost;
  className?: string;
}) {
  const session = await getServerSession(authOptions);

  const isCurrentUser = post.user_id === session?.user.id;
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
            user_id: post.user_id
          }
        },
        LikePost: {
          where: {
            post_id: post.post_id
          }
        }
      }
    });

    isFollowing = !!currentUserWithRelations?.following.length;
    initialLiked = !!currentUserWithRelations?.LikePost.length;
  }

  return (
    <div
      className={cn(
        "p-4 space-y-3 transition-colors",
        className
      )}>
      <div className="flex gap-2 flex-col">
        <div className="flex justify-between">
          <Link className="flex w-fit gap-2 items-center cursor-pointer" href={`/profile/${post.user.username}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/icon"></AvatarImage>
              <AvatarFallback>PFP</AvatarFallback>
            </Avatar>
            <span>
              {post.user.username}
            </span>
          </Link>
          {!isCurrentUser && (
            <FollowButton targetUserId={post.user_id} isFollowing={isFollowing} />
          )}
        </div>

        <PostImages images={post.images} />

        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">{post.post_title}</h3>
            <span className="text-muted-foreground">{post.created_at.toLocaleDateString()}</span>
          </div>
          <LikePostButton postId={post.post_id} initialLiked={initialLiked} />
        </div>
        <span className="">{post.post_text}</span>
      </div>
    </div>
  );
}