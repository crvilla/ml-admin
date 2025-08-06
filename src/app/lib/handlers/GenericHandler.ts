import { BaseHandler } from './BaseHandler'
import { HandlerResponse, HandlerWSResponse } from '@/types/handlers'
import { sendWhatsAppMessage } from '../utils/sendWhatsAppMessage'

function buildDefaultResponse(
  message: string,
  type: string,
  contact: { wa_id: string; profile?: { name: string } }
): HandlerWSResponse {
  return {
    messageResponse: message,
    type: type || 'unknown',
    response: {
      phone: contact.wa_id,
      name: contact.profile?.name ?? '',
      data: {},
    },
  }
}

export class GenericHandler extends BaseHandler {
  async handle(): Promise<HandlerResponse> {
    const type = this.message?.type || 'unknown'
    const botName = this.bot.name
    const waId = this.contact.wa_id

    const message = `🔄 El tipo de mensaje "${type}" aún no está disponible para este bot.\n\nEstamos trabajando para que muy pronto puedas enviarnos este tipo de contenido sin problema. ¡Gracias por tu paciencia! 🙌`

    console.warn(`⚠️ Tipo de mensaje "${type}" no implementado para el bot "${botName}"`)

    await sendWhatsAppMessage({
      botId: this.bot.id,
      phone: waId,
      message,
    })

    return buildDefaultResponse(message, type, this.contact)
  }
}
