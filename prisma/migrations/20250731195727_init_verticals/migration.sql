-- CreateEnum
CREATE TYPE "VariableType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'ENUM', 'DATE');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "verticalId" TEXT;

-- CreateTable
CREATE TABLE "Vertical" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vertical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerticalVariable" (
    "id" TEXT NOT NULL,
    "verticalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "VariableType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerticalVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessActiveVariable" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "verticalVariableId" TEXT NOT NULL,
    "apiFieldName" TEXT NOT NULL,
    "isFilterable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessActiveVariable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vertical_slug_key" ON "Vertical"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VerticalVariable_verticalId_slug_key" ON "VerticalVariable"("verticalId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessActiveVariable_businessId_verticalVariableId_key" ON "BusinessActiveVariable"("businessId", "verticalVariableId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "Vertical"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerticalVariable" ADD CONSTRAINT "VerticalVariable_verticalId_fkey" FOREIGN KEY ("verticalId") REFERENCES "Vertical"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActiveVariable" ADD CONSTRAINT "BusinessActiveVariable_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessActiveVariable" ADD CONSTRAINT "BusinessActiveVariable_verticalVariableId_fkey" FOREIGN KEY ("verticalVariableId") REFERENCES "VerticalVariable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
