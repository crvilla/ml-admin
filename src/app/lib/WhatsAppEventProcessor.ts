import { handlerFactory } from './handlers/handlerFactory'
import { BusinessBot } from '@prisma/client'
import { WhatsAppPayload, WhatsAppMessage, WhatsAppContact } from '@/types/whatsapp'
import { HandlerResponse } from '@/types/handlers'

export class WhatsAppEventProcessor {
  private bot: BusinessBot
  private value: WhatsAppPayload
  private message: WhatsAppMessage | undefined
  private contact: WhatsAppContact | undefined

  constructor(bot: BusinessBot, value: WhatsAppPayload) {
    this.bot = bot
    this.value = value
    this.message = value.messages?.[0]
    this.contact = value.contacts?.[0]
  }

  async process(): Promise<HandlerResponse> {
    const type = this.message?.type

    if (!type || !this.message || !this.contact) {
      console.warn('❌ Información incompleta: tipo, mensaje o contacto')
      return {
        messageResponse: 'No se pudo procesar el mensaje.',
        type: type || 'unknown',
        response: {
          phone: this.contact?.wa_id || '',
          name: this.contact?.profile?.name ?? '',
          data: {},
        },
      }
    }

    const handler = handlerFactory(type, {
      bot: this.bot,
      value: this.value,
      message: this.message,
      contact: this.contact,
    })

    return await handler.handle()
  }
}
