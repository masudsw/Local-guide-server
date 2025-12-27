/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PAID';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentStatus";
