import { BaseHandler } from './BaseHandler'
import { prisma } from '@/lib/prisma'
import { HandlerResponse, HandlerWSResponse } from '@/types/handlers'

function buildDefaultResponse(message: string, type: string, contact: { wa_id: string; profile?: { name: string } }): HandlerWSResponse {
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

export class MediaHandler extends BaseHandler {
  async handle(): Promise<HandlerResponse> {
    const type = this.message?.type || 'unknown'
    const env = this.bot.whatsappConfig.environment

    const eventType = await prisma.webhookEventType.findFirst({
      where: { type, active: true },
    })

    if (!eventType) {
      return buildDefaultResponse(`No podemos procesar el tipo "${type}" aún.`, type, this.contact)
    }

    const isEnabledForBot = await prisma.businessBotEventType.findFirst({
      where: {
        botId: this.bot.id,
        eventTypeId: eventType.id,
      },
    })

    if (!isEnabledForBot) {
      return buildDefaultResponse(`Este bot no tiene activado el tipo "${type}".`, type, this.contact)
    }

    const url = env === 'DEV' ? eventType.webhookTestURL : eventType.webhookURL

    if (!url) {
      return buildDefaultResponse(`No hay webhook configurado para el tipo "${type}".`, type, this.contact)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        botId: this.bot.id,
        botName: this.bot.name,
        contact: this.contact,
        message: this.message,
        fullPayload: this.value,
      }),
    })

    const data: HandlerResponse | null = await response.json().catch(() => null)

    console.log(`📩 Respuesta de N8N (${type}):`, data)

    return data || buildDefaultResponse('Mensaje procesado sin respuesta.', type, this.contact)
  }
}
