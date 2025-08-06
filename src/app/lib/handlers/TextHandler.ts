import { isProcessing, markProcessing, unmarkProcessing } from '../utils/messageLocks'
import { getThinkingMessage } from '../utils/messageUtils.ts'
import { sendWhatsAppMessage } from '../utils/sendWhatsAppMessage'
import { BaseHandler } from './BaseHandler'
import { HandlerResponse } from '@/types/handlers'

export class TextHandler extends BaseHandler {
  async handle(): Promise<HandlerResponse> {
    const waId = this.contact.wa_id

    if (isProcessing(waId)) {
      console.log('🚫 Ignorando mensaje porque hay uno en proceso')
      return {
        messageResponse: 'Estamos procesando tu mensaje anterior. Por favor espera un momento.',
        type: 'text',
        response: {
          phone: waId,
          name: this.contact.profile?.name ?? '',
          data: {},
        },
      }
    }

    markProcessing(waId)

    await sendWhatsAppMessage({
      botId: this.bot.id,
      phone: waId,
      message: getThinkingMessage(),
    })

    const env = this.bot.whatsappConfig.environment
    const url = env === 'DEV' ? this.bot.webhookTestURL : this.bot.webhookURL

    if (!url) {
      console.warn('❌ No se encontró webhook para texto')
      unmarkProcessing(waId)
      return {
        messageResponse: 'No hay webhook configurado para texto.',
        type: 'text',
        response: {
          phone: waId,
          name: this.contact.profile?.name ?? '',
          data: {},
        },
      }
    }

    const integration = this.bot.apiIntegrations[0]
    const xBusinessToken = integration?.publicApiKey ?? ''
    const urlLmBussines = integration?.api?.baseUrl ?? ''

    let urlLmLead = ''
    for (const subApi of integration?.subApis ?? []) {
      if (subApi.api?.name === 'leads_api') {
        urlLmLead = subApi.api.baseUrl
        break
      }
    }

    const payloadToSend = {
      type: 'text',
      botId: this.bot.id,
      botName: this.bot.name,
      contact: this.contact,
      message: this.message,
      fullPayload: this.value,
      x_business_token: xBusinessToken,
      url_lm_bussines: urlLmBussines,
      url_lm_lead: urlLmLead,
    }

    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend),
      })
    } catch (error) {
      console.error('❌ Error haciendo fetch a N8N:', error)
      unmarkProcessing(waId)
      return {
        messageResponse: 'Error conectando con el webhook.',
        type: 'text',
        response: {
          phone: waId,
          name: this.contact.profile?.name ?? '',
          data: { error: String(error) },
        },
      }
    }

    const raw = await response.text()
    const contentType = response.headers.get('content-type')
    console.log('📩 Respuesta RAW de N8N:', raw)
    console.log('🧾 Content-Type de N8N:', contentType)
    console.log('📦 Status de N8N:', response.status)

    let data: HandlerResponse | null = null
    try {
      data = JSON.parse(raw)
      console.log('✅ JSON parseado de N8N:', JSON.stringify(data, null, 2))
    } catch (e) {
      console.warn('⚠️ Error parseando respuesta de N8N:', e)
    }

    unmarkProcessing(waId)

    const fallbackResponse = {
      messageResponse: 'Mensaje procesado sin respuesta.',
      type: 'text',
      response: {
        phone: waId,
        name: this.contact.profile?.name ?? '',
        data: {},
      },
    }

    const finalResponse = data ?? fallbackResponse
    const singleResponse = Array.isArray(finalResponse) ? finalResponse[0] : finalResponse

    await sendWhatsAppMessage({
      botId: this.bot.id,
      phone: singleResponse.response.phone,
      message: singleResponse.messageResponse,
    })

    return finalResponse

  }
}
