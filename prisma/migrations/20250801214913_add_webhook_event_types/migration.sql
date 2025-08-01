-- CreateTable
CREATE TABLE "WebhookEventType" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessBotEventType" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "eventTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessBotEventType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessBotEventType_botId_eventTypeId_key" ON "BusinessBotEventType"("botId", "eventTypeId");

-- AddForeignKey
ALTER TABLE "BusinessBotEventType" ADD CONSTRAINT "BusinessBotEventType_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BusinessBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessBotEventType" ADD CONSTRAINT "BusinessBotEventType_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "WebhookEventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
