/*
  Warnings:

  - You are about to drop the column `body` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `Watchlist` table. All the data in the column will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,viewingId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,viewingId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ratingCharacter` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingOverall` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingPlot` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingWorld` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textReview` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewingId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewingId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('movie', 'series', 'anime');

-- CreateEnum
CREATE TYPE "public"."ExternalSource" AS ENUM ('TMDB', 'ANILIST');

-- CreateEnum
CREATE TYPE "public"."WatchlistStatus" AS ENUM ('planned', 'watching', 'completed');

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Watchlist" DROP CONSTRAINT "Watchlist_mediaId_fkey";

-- DropIndex
DROP INDEX "public"."Watchlist_userId_mediaId_key";

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "body",
DROP COLUMN "mediaId",
DROP COLUMN "rating",
DROP COLUMN "title",
ADD COLUMN     "ratingCharacter" INTEGER NOT NULL,
ADD COLUMN     "ratingOverall" INTEGER NOT NULL,
ADD COLUMN     "ratingPlot" INTEGER NOT NULL,
ADD COLUMN     "ratingWorld" INTEGER NOT NULL,
ADD COLUMN     "textReview" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Watchlist" DROP COLUMN "mediaId",
ADD COLUMN     "status" "public"."WatchlistStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewingId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Media";

-- CreateTable
CREATE TABLE "public"."Viewings" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalSource" "public"."ExternalSource" NOT NULL,
    "title" TEXT NOT NULL,
    "category" "public"."Category" NOT NULL,
    "releaseYear" INTEGER,
    "posterUrl" TEXT,
    "totalEps" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Viewings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Viewings_category_idx" ON "public"."Viewings"("category");

-- CreateIndex
CREATE INDEX "Viewings_createdAt_idx" ON "public"."Viewings"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Viewings_externalSource_externalId_key" ON "public"."Viewings"("externalSource", "externalId");

-- CreateIndex
CREATE INDEX "Review_createdAt_idx" ON "public"."Review"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_viewingId_key" ON "public"."Review"("userId", "viewingId");

-- CreateIndex
CREATE INDEX "Watchlist_status_createdAt_idx" ON "public"."Watchlist"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_viewingId_key" ON "public"."Watchlist"("userId", "viewingId");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_viewingId_fkey" FOREIGN KEY ("viewingId") REFERENCES "public"."Viewings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_viewingId_fkey" FOREIGN KEY ("viewingId") REFERENCES "public"."Viewings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
