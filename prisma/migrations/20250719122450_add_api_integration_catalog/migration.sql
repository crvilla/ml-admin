-- CreateEnum
CREATE TYPE "EnvironmentType" AS ENUM ('DEV', 'PROD');

-- CreateTable
CREATE TABLE "ApiIntegrationCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "type" "EnvironmentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiIntegrationCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiIntegrationCatalog_name_type_key" ON "ApiIntegrationCatalog"("name", "type");
