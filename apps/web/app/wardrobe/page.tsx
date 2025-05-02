import type { OutfitWithItems } from "@/components/wardrobe/outfit"
import { SmallOutfit } from "@/components/wardrobe/small-outfit"
import { Skeleton } from "@/components/ui/skeleton"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChevronRight, PlusCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { CreateOutfitQuickAction } from "@/components/wardrobe/create-outit-quick-action"
import { UploadItemQuickAction } from "@/components/wardrobe/upload-item-quick-action"

// Skeleton loaders for outfits
function OutfitSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-md" />
        ))}
      </div>
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

// Skeleton loaders for clothing items
function ClothingItemSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="aspect-square w-full rounded-md" />
      <div className="h-5 bg-black/50 rounded-sm flex items-center px-1">
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

export default async function WardrobePage() {
  const session = await getServerSession(authOptions)

  if (!session) return redirect("/sign-in")

  // Fetch recent outfits with related items and tags
  const recentOutfits = (await prisma.outfit.findMany({
    where: {
      user_id: session.user.id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 3,
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
        },
      },
    },
  })) as OutfitWithItems[] | null

  // Fetch recent clothing items
  const clothes = await prisma.item.findMany({
    where: {
      user_id: session.user.id,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 4,
    include: {
      category_tag: true,
      colour_tag: true,
      size_tag: true,
    },
  })

  return (
    <div className="container space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Wardrobe</h1>

      {/* Outfits Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Outfits</h2>
        </div>

        <Link href="/wardrobe/outfits">
          <div className="border rounded-xl pl-4 py-4 pr-1 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center">
              <div className="flex-1 grid grid-cols-3 gap-4">
                <Suspense
                  fallback={
                    <>
                      <OutfitSkeleton />
                      <OutfitSkeleton />
                    </>
                  }
                >
                  {recentOutfits && recentOutfits.length > 0 ? (
                    recentOutfits.map((outfit) => (
                      <SmallOutfit className="flex-1" key={outfit.outfit_id} outfit={outfit} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-2">No outfits created yet</p>
                  )}
                </Suspense>
              </div>
              <div className="ml-2">
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Clothes Items Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Clothes</h2>
        </div>

        <Link href="/wardrobe/clothes">
          <div className="border rounded-xl pl-4 py-4 pr-1 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Suspense
                  fallback={
                    <>
                      <ClothingItemSkeleton />
                      <ClothingItemSkeleton />
                      <ClothingItemSkeleton />
                      <ClothingItemSkeleton />
                    </>
                  }
                >
                  {clothes && clothes.length > 0 ? (
                    clothes.map((item) => (
                      <div key={item.item_id} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                        {item.item_url ? (
                          <Image
                            src={item.item_url || "/placeholder.svg"}
                            alt={item.item_name || "Clothing item"}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <p className="text-xs text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                          <p className="text-xs text-white truncate">{item.item_name || "Unnamed item"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground col-span-4">No clothing items added yet</p>
                  )}
                </Suspense>
              </div>
              <div className="ml-2">
                <ChevronRight className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <CreateOutfitQuickAction />
        <UploadItemQuickAction />
      </section>
    </div>
  )
}
