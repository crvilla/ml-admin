import { BusinessBot } from '@prisma/client'
import { WhatsAppPayload, WhatsAppMessage, WhatsAppContact } from '@/types/whatsapp'
import { HandlerResponse } from '@/types/handlers'

export interface HandlerContext {
  bot: BusinessBot
  value: WhatsAppPayload
  message: WhatsAppMessage
  contact: WhatsAppContact
}

export abstract class BaseHandler {
  protected bot: BusinessBot
  protected value: WhatsAppPayload
  protected message: WhatsAppMessage
  protected contact: WhatsAppContact

  constructor({ bot, value, message, contact }: HandlerContext) {
    this.bot = bot
    this.value = value
    this.message = message
    this.contact = contact
  }

  abstract handle(): Promise<HandlerResponse>
}
