-- DropForeignKey
ALTER TABLE "BusinessApiIntegration" DROP CONSTRAINT "BusinessApiIntegration_botId_fkey";

-- AlterTable
ALTER TABLE "BusinessApiIntegration" ALTER COLUMN "status" SET DEFAULT 'INACTIVE',
ALTER COLUMN "botId" DROP NOT NULL;

-- DropEnum
DROP TYPE "ApiName";

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BusinessBot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
