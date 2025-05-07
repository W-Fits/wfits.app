import { prisma } from "@/lib/prisma";
import { ExtendedUser } from "../page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <Avatar className="w-8 h-8">
              <AvatarImage src="/icon"></AvatarImage>
              <AvatarFallback>PFP</AvatarFallback>
            </Avatar>
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