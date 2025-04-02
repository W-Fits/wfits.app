-- CreateEnum
CREATE TYPE "EnvironmentEnum" AS ENUM ('Warm', 'Cold');

-- CreateEnum
CREATE TYPE "TempEnum" AS ENUM ('C', 'F');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTag" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(35) NOT NULL,

    CONSTRAINT "CategoryTag_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "ColourTag" (
    "colour_id" SERIAL NOT NULL,
    "colour_name" VARCHAR(35) NOT NULL,
    "colour_value" CHAR(7) NOT NULL,

    CONSTRAINT "ColourTag_pkey" PRIMARY KEY ("colour_id")
);

-- CreateTable
CREATE TABLE "Item" (
    "item_id" SERIAL NOT NULL,
    "colour_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "item_name" VARCHAR(50) NOT NULL,
    "item_url" TEXT NOT NULL,
    "waterproof" BOOLEAN,
    "available" BOOLEAN,
    "slot" INTEGER NOT NULL,
    "environment" "EnvironmentEnum",

    CONSTRAINT "Item_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "Outfit" (
    "outfit_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATE NOT NULL,

    CONSTRAINT "Outfit_pkey" PRIMARY KEY ("outfit_id")
);

-- CreateTable
CREATE TABLE "OutfitItem" (
    "outfit_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "OutfitItem_pkey" PRIMARY KEY ("outfit_id","item_id")
);

-- CreateTable
CREATE TABLE "SizeTag" (
    "size_id" SERIAL NOT NULL,
    "size_name" VARCHAR(35) NOT NULL,

    CONSTRAINT "SizeTag_pkey" PRIMARY KEY ("size_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(60) NOT NULL,
    "password" TEXT,
    "firstname" VARCHAR(50),
    "lastname" VARCHAR(50),
    "email" VARCHAR(150) NOT NULL,
    "set_temp" "TempEnum" DEFAULT 'C',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "Account_user_id_idx" ON "Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTag_category_name_key" ON "CategoryTag"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "ColourTag_colour_name_key" ON "ColourTag"("colour_name");

-- CreateIndex
CREATE UNIQUE INDEX "ColourTag_colour_value_key" ON "ColourTag"("colour_value");

-- CreateIndex
CREATE UNIQUE INDEX "SizeTag_size_name_key" ON "SizeTag"("size_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CategoryTag"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_colour_id_fkey" FOREIGN KEY ("colour_id") REFERENCES "ColourTag"("colour_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "SizeTag"("size_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Outfit" ADD CONSTRAINT "Outfit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OutfitItem" ADD CONSTRAINT "OutfitItem_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "Outfit"("outfit_id") ON DELETE CASCADE ON UPDATE NO ACTION;
