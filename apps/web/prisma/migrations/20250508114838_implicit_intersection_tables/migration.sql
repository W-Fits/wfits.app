/*
  Warnings:

  - You are about to drop the `LikeOutfit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikePost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikeOutfit" DROP CONSTRAINT "LikeOutfit_outfit_id_fkey";

-- DropForeignKey
ALTER TABLE "LikeOutfit" DROP CONSTRAINT "LikeOutfit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "LikePost" DROP CONSTRAINT "LikePost_post_id_fkey";

-- DropForeignKey
ALTER TABLE "LikePost" DROP CONSTRAINT "LikePost_user_id_fkey";

-- DropTable
DROP TABLE "LikeOutfit";

-- DropTable
DROP TABLE "LikePost";

-- CreateTable
CREATE TABLE "_LikedOutfits" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LikedOutfits_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LikedPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LikedPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LikedOutfits_B_index" ON "_LikedOutfits"("B");

-- CreateIndex
CREATE INDEX "_LikedPosts_B_index" ON "_LikedPosts"("B");

-- AddForeignKey
ALTER TABLE "_LikedOutfits" ADD CONSTRAINT "_LikedOutfits_A_fkey" FOREIGN KEY ("A") REFERENCES "Outfit"("outfit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedOutfits" ADD CONSTRAINT "_LikedOutfits_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedPosts" ADD CONSTRAINT "_LikedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
