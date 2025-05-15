import { prisma } from "@/lib/prisma";
import { ExtendedUser } from "../page";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FollowButton } from "@/components/shared/follow-button";
import { ProfilePhoto } from "@/components/shared/profile-photo";

export default async function ProfileFollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const profile = await prisma.user.findFirst({
    where: { username },
    include: {
      outfits: {
        include: {
          outfit_items: {
            include: {
              item: {
                include: {
                  category_tag: true,
                  colour_tag: true,
                  size_tag: true,
                },
              },
            }
          }
        }
      },
      following: true,
      followedBy: true,
    },
  }) as ExtendedUser | null;

  if (!profile) return notFound();

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-2 p-4 border-b">
        <Link href={`/profile/username`}>
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">
          Following {username}
        </h1>
      </header>
      <main className="flex flex-col gap-2 p-4">
        {profile.following.length > 0 ? profile.following.map((user) => (
          <div key={user.user_id} className="flex items-center justify-between">
            <Link className="flex items-center gap-2" href={`/profile/${user.username}`}>
              <ProfilePhoto
                className="w-8 h-8"
                src={user.profile_photo}
                username={user.username}
              />
              <span className="text-lg ">
                {user.username}
              </span>
            </Link>
            <FollowButton targetUserId={user.user_id} isFollowing={true} />
          </div>
        )) : (
          <span>Not following anyone.</span>
        )}
      </main>
    </div>
  )
}