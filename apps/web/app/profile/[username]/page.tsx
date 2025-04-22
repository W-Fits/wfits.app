import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Cog, Heart, LogOut, Rss, Shirt } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExtendedItem, Outfit, OutfitWithItems } from "@/components/wardrobe/outfit";
import { Outfit as OutfitType, User } from "@prisma/client";
import { SmallOutfit } from "@/components/wardrobe/small-outfit";

export interface ExtendedOutfit extends OutfitType {
  outfit_items: {
    item_id: number;
    outfit_id: number;
    item: ExtendedItem;
  }[];
}

export interface ExtendedUser extends User {
  outfits: ExtendedOutfit[];
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
    },
  }) as ExtendedUser | null;

  if (!profile) return notFound();

  const session = await getServerSession(authOptions);
  const isCurrentUser = session?.user?.id === profile.user_id;

  return (
    <main className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="flex w-full justify-between">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={""} alt={profile.username} />
            <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
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
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.firstname}</h1>
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
          <div className="grid grid-cols-3 gap-2">
            {/* Posts content would go here */}
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">Post {i + 1}</span>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="outfits" className="space-y-4">
          {profile.outfits &&
            profile.outfits.length > 0 &&
            profile.outfits.map((outfit) => (
              <SmallOutfit key={outfit.outfit_id} outfit={outfit} />
            ))}
        </TabsContent>

        <TabsContent value="liked" className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Liked posts content would go here */}
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">Liked {i + 1}</span>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

