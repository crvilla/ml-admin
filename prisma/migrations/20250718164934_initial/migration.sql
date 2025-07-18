-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'BLOCKED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ApiName" AS ENUM ('LEADS', 'CHATS');

-- CreateEnum
CREATE TYPE "ApiIntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "WSEnvironment" AS ENUM ('DEV', 'TEST', 'PROD');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "changePassword" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING',
    "apiKeyPrivate" TEXT NOT NULL,
    "webhookToken" TEXT,
    "webhookURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessApiIntegration" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "apiName" "ApiName" NOT NULL,
    "externalId" TEXT NOT NULL,
    "publicApiKey" TEXT NOT NULL,
    "status" "ApiIntegrationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessApiIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessWhatsappConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "wabaId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "senderPhoneNumber" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "environment" "WSEnvironment" NOT NULL,
    "testDestinationNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessWhatsappConfig_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Business_apiKeyPrivate_key" ON "Business"("apiKeyPrivate");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApiIntegration_publicApiKey_key" ON "BusinessApiIntegration"("publicApiKey");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessApiIntegration_businessId_apiName_key" ON "BusinessApiIntegration"("businessId", "apiName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessApiIntegration" ADD CONSTRAINT "BusinessApiIntegration_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessWhatsappConfig" ADD CONSTRAINT "BusinessWhatsappConfig_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBot" ADD CONSTRAINT "BusinessBot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBot" ADD CONSTRAINT "BusinessBot_whatsappConfigId_fkey" FOREIGN KEY ("whatsappConfigId") REFERENCES "BusinessWhatsappConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
