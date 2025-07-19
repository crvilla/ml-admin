/*
  Warnings:

  - You are about to drop the column `apiName` on the `BusinessApiIntegration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,apiId]` on the table `BusinessApiIntegration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiId` to the `BusinessApiIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BusinessApiIntegration_businessId_apiName_key";

-- AlterTable
ALTER TABLE "BusinessApiIntegration" DROP COLUMN "apiName",
ADD COLUMN     "apiId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApiIntegration_businessId_apiId_key" ON "BusinessApiIntegration"("businessId", "apiId");

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiIntegrationCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
