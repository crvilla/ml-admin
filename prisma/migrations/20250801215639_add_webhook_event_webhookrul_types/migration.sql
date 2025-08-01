-- AlterTable
ALTER TABLE "WebhookEventType" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhookTestURL" TEXT,
ADD COLUMN     "webhookURL" TEXT;
