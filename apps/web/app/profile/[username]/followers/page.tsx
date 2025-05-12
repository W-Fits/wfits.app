import { prisma } from "@/lib/prisma";
import { ExtendedUser } from "@/app/profile/[username]/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProfilePhoto } from "@/components/shared/profile-photo";

export default async function ProfileFollowersPage({ params }: { params: Promise<{ username: string }> }) {
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

  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.id === profile.user_id;

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-2 p-4 border-b">
        <Link href={`/profile/username`}>
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">
          {username + "'s"} Followers
        </h1>
      </header>
      <main className="flex flex-col gap-2 p-4">
        {profile.followedBy.length > 0 ? profile.followedBy.map((user) => (
          <Link className="flex items-center" href={`/profile/${user.username}`}>
            <ProfilePhoto
              className="w-8 h-8"
              src={user.profile_photo}
              username={user.username}
            />
            <span>
              {user.username}
            </span>
          </Link>
        )) : (
          <span>No followers</span>
        )}
      </main>
    </div>
  )
}