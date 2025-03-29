import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Heart, Rss, Shirt } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const profile = await prisma.user.findFirst({ where: { username } });

  if (!profile) return notFound();

  return (
    <main className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarImage src={""} alt={profile.username} />
          <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

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
          <div className="grid grid-cols-3 gap-2">
            {/* Outfits content would go here */}
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">Outfit {i + 1}</span>
                </div>
              ))}
          </div>
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

