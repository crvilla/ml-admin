import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIdFromUrl } from '@/lib/helpers'
import { WhatsAppEventProcessor } from '@/app/lib/WhatsAppEventProcessor'
import { HandlerWSResponse } from '@/types/handlers'

function isHandlerWSResponse(obj: unknown): obj is HandlerWSResponse {
  if (
    typeof obj !== 'object' ||
    obj === null
  ) return false

  const maybe = obj as Partial<HandlerWSResponse>

  return (
    typeof maybe.messageResponse === 'string' &&
    typeof maybe.type === 'string' &&
    typeof maybe.response === 'object' &&
    maybe.response !== null &&
    typeof maybe.response?.phone === 'string'
  )
}

// GET: Validación del webhook de WhatsApp
export async function GET(req: NextRequest) {
  const botId = getIdFromUrl(req)

  if (!botId) {
    return new NextResponse('ID de bot inválido', { status: 400 })
  }

  const searchParams = req.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (!mode || !token || !challenge) {
    return new NextResponse('Faltan parámetros', { status: 400 })
  }

  const bot = await prisma.businessBot.findUnique({
    where: { id: botId },
  })

  if (!bot || bot.whatsappWebhookToken !== token) {
    return new NextResponse('Token inválido', { status: 403 })
  }

  return new NextResponse(challenge, { status: 200 })
}

// POST: Recepción de mensajes entrantes y reenvío a N8N
export async function POST(req: NextRequest) {
  const botId = getIdFromUrl(req)

  try {
    if (!botId) {
      return new NextResponse('ID de bot inválido', { status: 400 })
    }

    const body = await req.json()

    if (body.object !== 'whatsapp_business_account') {
      return new NextResponse('No es un evento de WhatsApp', { status: 400 })
    }

    const bot = await prisma.businessBot.findUnique({
      where: { id: botId },
      include: {
        whatsappConfig: true,
        apiIntegrations: {
          include: {
            api: true,
            subApis: {
              include: {
                api: true,
              },
            },
          },
        },
      },
    })

    if (!bot) {
      return new NextResponse('Bot no encontrado', { status: 404 })
    }

    const entries = body.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []

      for (const change of changes) {
        if (change.field !== 'messages') continue

        const value = change.value

        const processor = new WhatsAppEventProcessor(bot, value)
        const result = await processor.process()

        console.log('✅ Resultado del procesamiento del mensaje:', result)

        if (Array.isArray(result)) {
          for (const r of result) {
            if (isHandlerWSResponse(r)) {
              console.log(`📤 Tipo: ${r.type}, Tel: ${r.response.phone}, Texto: ${r.messageResponse}`)
            } else {
              console.warn('⚠️ Respuesta inválida de N8N (array):', r)
            }
          }
        } else {
          if (isHandlerWSResponse(result)) {
            console.log(`📤 Tipo: ${result.type}, Tel: ${result.response.phone}, Texto: ${result.messageResponse}`)
          } else {
            console.warn('⚠️ Respuesta inválida de N8N (objeto):', result)
          }
        }
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (err) {
    console.error('[WEBHOOK_POST_ERROR]', err)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}

