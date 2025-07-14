-- CreateEnum
CREATE TYPE "WSEnvironment" AS ENUM ('DEV', 'TEST', 'PROD');

-- CreateTable
CREATE TABLE "BusinessWhatsappConfig" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "wabaId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "senderPhoneNumber" TEXT NOT NULL,
    "environment" "WSEnvironment" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessWhatsappConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessWhatsappConfig_businessId_key" ON "BusinessWhatsappConfig"("businessId");

-- AddForeignKey
ALTER TABLE "BusinessWhatsappConfig" ADD CONSTRAINT "BusinessWhatsappConfig_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
