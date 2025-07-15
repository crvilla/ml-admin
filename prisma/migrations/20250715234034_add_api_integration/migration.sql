-- CreateEnum
CREATE TYPE "ApiName" AS ENUM ('LEADS', 'CHATS');

-- CreateEnum
CREATE TYPE "ApiIntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "BusinessApiIntegration" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "apiName" "ApiName" NOT NULL,
    "externalId" TEXT NOT NULL,
    "publicApiKey" TEXT NOT NULL,
    "status" "ApiIntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "whatsappConfigId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessApiIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApiIntegration_publicApiKey_key" ON "BusinessApiIntegration"("publicApiKey");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApiIntegration_businessId_apiName_key" ON "BusinessApiIntegration"("businessId", "apiName");

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_whatsappConfigId_fkey" FOREIGN KEY ("whatsappConfigId") REFERENCES "BusinessWhatsappConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
