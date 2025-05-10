
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cog, Heart, LogOut, Rss, Shirt } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExtendedItem } from "@/components/wardrobe/outfit";
import { Outfit as OutfitType, User } from "@prisma/client";
import { OutfitGrid } from "@/components/wardrobe/outfit-grid";
import { PostList } from "@/components/profile/post-list";
import { LikesList } from "@/components/profile/likes-list";
import { ProfilePhoto } from "@/components/shared/profile-photo";
import { FollowButton } from "@/components/shared/follow-button";

export interface ExtendedOutfit extends OutfitType {
  outfit_items: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[];
  user: User;
}

export interface ExtendedUser extends User {
  outfits: ExtendedOutfit[];
  following: User[];
  followedBy: User[];
};

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
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
  const isFollowing = !isCurrentUser && !!profile.followedBy.find((user) => user.user_id === session?.user.id);

  return (
    <main className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="flex w-full justify-between">
          <div className="flex gap-2">
            <ProfilePhoto src={profile.profile_photo} username={profile.username} />
            <div className="mt-4 ml-4 grid grid-cols-2 gap-2">
              <Link className="flex flex-col text-center" href={`/profile/${username}/followers`}>
                <span>
                  {profile.followedBy.length}
                </span>
                <span className="-mt-1 text-sm text-muted-foreground">
                  Followers
                </span>
              </Link>
              <Link className="flex flex-col text-center" href={`/profile/${username}/following`}>
                <span>
                  {profile.following.length}
                </span>
                <span className="-mt-1 text-sm text-muted-foreground">
                  Following
                </span>
              </Link>
            </div>
          </div>
          {isCurrentUser && (
            <div className="space-x-1">
              <Link
                href="/profile/settings"
              >
                <Button
                  size="icon"
                  variant="secondary"
                >
                  <Cog className="h-6 w-6 text-muted-foreground" />
                </Button>
              </Link>
              <Link
                href="/sign-out"
              >
                <Button
                  size="icon"
                  variant="secondary"
                >
                  <LogOut className="h-6 w-6 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          )}
          {!isCurrentUser && (
            <FollowButton
              targetUserId={profile.user_id}
              isFollowing={isFollowing}
            />
          )}
        </div>


        <div className="flex-1">
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full mt-6">
        <div className="flex justify-center border-b border-border">
          <TabsList className="flex h-auto bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-1 flex-1 px-8 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary relative h-auto"
            >
              <Rss className="h-4 w-4" /> Posts
            </TabsTrigger>
            <TabsTrigger
              value="outfits"
              className="flex items-center gap-1 flex-1 px-8 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary relative h-auto"
            >
              <Shirt className="h-4 w-4d" /> Outfits
            </TabsTrigger>
            <TabsTrigger
              value="liked"
              className="flex items-center gap-1 flex-1 px-8 py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary relative h-auto"
            >
              <Heart className="h-4 w-4d" /> Likes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="space-y-4">
          <PostList id={profile.user_id} />
        </TabsContent>

        <TabsContent value="outfits" className="space-y-4">
          <OutfitGrid outfits={profile.outfits} />
        </TabsContent>

        <TabsContent value="liked" className="space-y-4">
          <LikesList id={profile.user_id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

