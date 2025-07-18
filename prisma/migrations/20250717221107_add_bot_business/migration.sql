/*
  Warnings:

  - You are about to drop the column `whatsappConfigId` on the `BusinessApiIntegration` table. All the data in the column will be lost.
  - Added the required column `name` to the `BusinessWhatsappConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessApiIntegration" DROP CONSTRAINT "BusinessApiIntegration_whatsappConfigId_fkey";

-- AlterTable
ALTER TABLE "BusinessApiIntegration" DROP COLUMN "whatsappConfigId";

-- AlterTable
ALTER TABLE "BusinessWhatsappConfig" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BusinessBot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "webhookURL" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "whatsappConfigId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessBot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessBot" ADD CONSTRAINT "BusinessBot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBot" ADD CONSTRAINT "BusinessBot_whatsappConfigId_fkey" FOREIGN KEY ("whatsappConfigId") REFERENCES "BusinessWhatsappConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
