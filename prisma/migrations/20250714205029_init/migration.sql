-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'BLOCKED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING',
    "apiKeyPrivate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_apiKeyPrivate_key" ON "Business"("apiKeyPrivate");
