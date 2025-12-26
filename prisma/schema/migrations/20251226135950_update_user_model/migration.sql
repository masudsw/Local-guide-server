/*
  Warnings:

  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `GuideProfile` table. All the data in the column will be lost.
  - You are about to drop the `GuideAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GuideAvailability" DROP CONSTRAINT "GuideAvailability_guideId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "totalPrice";

-- AlterTable
ALTER TABLE "GuideProfile" DROP COLUMN "hourlyRate";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "guideProfileId" TEXT;

-- DropTable
DROP TABLE "public"."GuideAvailability";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideProfileId_fkey" FOREIGN KEY ("guideProfileId") REFERENCES "GuideProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
