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
import { ProfilePhoto } from "../shared/profile-photo";

export interface ExtendedPost extends PostType {
  outfits: {
    outfit: ExtendedOutfit;
  }[];
  user: User;
}

export async function Post({
  post,
  className,
}: {
  post: ExtendedPost;
  className?: string;
}) {
  const session = await getServerSession(authOptions);

  const isCurrentUser = post.user_id === session?.user.id;
  let isFollowing = false;
  let initialLiked = false;

  if (session && !isCurrentUser) {
    const currentUserWithRelations = await prisma.user.findUnique({ // Changed from findFirst to findUnique as user_id is unique
      where: {
        user_id: session.user.id,
      },
      select: { // Use select for efficiency
        following: {
          where: {
            user_id: post.user_id,
          },
          select: {
            user_id: true // Select a minimal field to check existence
          }
        },
        // Check for the implicit many-to-many relationship
        likedPosts: {
          where: {
            post_id: post.post_id
          },
          select: {
            post_id: true // Select a minimal field to check existence
          }
        }
      },
    });

    isFollowing = !!currentUserWithRelations?.following.length;
    // Check the length of the likedPosts array from the implicit relation
    initialLiked = !!currentUserWithRelations?.likedPosts.length;
  }

  return (
    <div className={cn("p-4 space-y-3 transition-colors", className)}>
      <div className="flex gap-2 flex-col">
        <div className="flex justify-between">
          <Link
            className="flex w-fit gap-2 items-center cursor-pointer"
            href={`/profile/${post.user.username}`}
          >
            <ProfilePhoto
              className="w-8 h-8"
              src={post.user.profile_photo}
              username={post.user.username}
            />
            <span>{post.user.username}</span>
          </Link>
          {!isCurrentUser && (
            <FollowButton targetUserId={post.user_id} isFollowing={isFollowing} />
          )}
        </div>

        <PostImages images={post.images} />

        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold">{post.post_title}</h3>
            <span className="text-muted-foreground">
              {post.created_at.toLocaleDateString()}
            </span>
          </div>
          <LikePostButton postId={post.post_id} initialLiked={initialLiked} />
        </div>
        <span className="">{post.post_text}</span>
      </div>
    </div>
  );
}
