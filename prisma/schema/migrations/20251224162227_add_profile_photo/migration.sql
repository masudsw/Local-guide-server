/*
  Warnings:

  - A unique constraint covering the columns `[guideId,date,startTime,endTime]` on the table `GuideAvailability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guideId,dayOfWeek,startTime,endTime]` on the table `GuideAvailability` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,city,guideId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `GuideAvailability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuideAvailability" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "GuideAvailability_guideId_date_startTime_endTime_key" ON "GuideAvailability"("guideId", "date", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "GuideAvailability_guideId_dayOfWeek_startTime_endTime_key" ON "GuideAvailability"("guideId", "dayOfWeek", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_title_city_guideId_key" ON "Listing"("title", "city", "guideId");
