-- CreateTable
CREATE TABLE "BusinessSubApi" (
    "id" TEXT NOT NULL,
    "apiChatId" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "status" "ApiIntegrationStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSubApi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSubApi_apiChatId_apiId_key" ON "BusinessSubApi"("apiChatId", "apiId");

-- AddForeignKey
ALTER TABLE "BusinessSubApi" ADD CONSTRAINT "BusinessSubApi_apiChatId_fkey" FOREIGN KEY ("apiChatId") REFERENCES "BusinessApiIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSubApi" ADD CONSTRAINT "BusinessSubApi_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiIntegrationCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
