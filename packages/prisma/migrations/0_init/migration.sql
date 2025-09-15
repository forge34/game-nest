-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('Wishlist', 'Playing', 'Completed', 'Backlog', 'Dropped');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "rating" DOUBLE PRECISION,
    "summary" TEXT,
    "storyline" TEXT,
    "releaseDate" TIMESTAMP(3),
    "coverImageId" INTEGER,
    "gameId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Img" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Img_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Genre" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Platform" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "abbreviation" TEXT,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Screenshots" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "imageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgeRating" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "organization" INTEGER NOT NULL,
    "ratingCategory" INTEGER NOT NULL,
    "synopsis" TEXT,
    "ratingCoverUrl" TEXT,

    CONSTRAINT "AgeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGame" (
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "status" "public"."GameStatus" NOT NULL,
    "hoursPlayed" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPlayedAt" TIMESTAMP(3),
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateTable
CREATE TABLE "public"."GameMode" (
    "id" SERIAL NOT NULL,
    "igdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "GameMode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Collection" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CollectionGame" (
    "collectionId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionGame_pkey" PRIMARY KEY ("collectionId","gameId")
);

-- CreateTable
CREATE TABLE "public"."_GameToGameMode" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToGameMode_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GameToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GameToPlatform" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToPlatform_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SimilarGames" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SimilarGames_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_artworks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_artworks_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DevelopedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DevelopedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PublishedBy" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PublishedBy_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "public"."User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Game_igdbId_key" ON "public"."Game"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_coverImageId_key" ON "public"."Game"("coverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_gameId_key" ON "public"."Review"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Img_igdbId_key" ON "public"."Img"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_igdbId_key" ON "public"."Genre"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_igdbId_key" ON "public"."Platform"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_igdbId_key" ON "public"."Company"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Screenshots_igdbId_key" ON "public"."Screenshots"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "AgeRating_igdbId_key" ON "public"."AgeRating"("igdbId");

-- CreateIndex
CREATE UNIQUE INDEX "GameMode_igdbId_key" ON "public"."GameMode"("igdbId");

-- CreateIndex
CREATE INDEX "_GameToGameMode_B_index" ON "public"."_GameToGameMode"("B");

-- CreateIndex
CREATE INDEX "_GameToGenre_B_index" ON "public"."_GameToGenre"("B");

-- CreateIndex
CREATE INDEX "_GameToPlatform_B_index" ON "public"."_GameToPlatform"("B");

-- CreateIndex
CREATE INDEX "_SimilarGames_B_index" ON "public"."_SimilarGames"("B");

-- CreateIndex
CREATE INDEX "_artworks_B_index" ON "public"."_artworks"("B");

-- CreateIndex
CREATE INDEX "_DevelopedBy_B_index" ON "public"."_DevelopedBy"("B");

-- CreateIndex
CREATE INDEX "_PublishedBy_B_index" ON "public"."_PublishedBy"("B");

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "public"."Img"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Screenshots" ADD CONSTRAINT "Screenshots_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgeRating" ADD CONSTRAINT "AgeRating_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGame" ADD CONSTRAINT "UserGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionGame" ADD CONSTRAINT "CollectionGame_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionGame" ADD CONSTRAINT "CollectionGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToGameMode" ADD CONSTRAINT "_GameToGameMode_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToGameMode" ADD CONSTRAINT "_GameToGameMode_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."GameMode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToGenre" ADD CONSTRAINT "_GameToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToGenre" ADD CONSTRAINT "_GameToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToPlatform" ADD CONSTRAINT "_GameToPlatform_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToPlatform" ADD CONSTRAINT "_GameToPlatform_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SimilarGames" ADD CONSTRAINT "_SimilarGames_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SimilarGames" ADD CONSTRAINT "_SimilarGames_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_artworks" ADD CONSTRAINT "_artworks_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_artworks" ADD CONSTRAINT "_artworks_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Img"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DevelopedBy" ADD CONSTRAINT "_DevelopedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DevelopedBy" ADD CONSTRAINT "_DevelopedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PublishedBy" ADD CONSTRAINT "_PublishedBy_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PublishedBy" ADD CONSTRAINT "_PublishedBy_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

