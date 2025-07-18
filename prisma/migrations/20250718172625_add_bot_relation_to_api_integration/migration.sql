/*
  Warnings:

  - Added the required column `botId` to the `BusinessApiIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessApiIntegration" ADD COLUMN     "botId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BusinessBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
